const User = require('../models/User');
const Order = require('../models/Order');
const Medicine = require('../models/Medicine');
const Prescription = require('../models/Prescription');
const ApiError = require('../utils/ApiError'); // Added missing import

const getAllUsers = async () => {
    return await User.find().select('-password -refreshToken').sort({ createdAt: -1 });
};

const updateUserRole = async (userId, role) => {
    const user = await User.findByIdAndUpdate(userId, { role }, { returnDocument: "after" }).select('-password -refreshToken');
    if (!user) throw new ApiError(404, 'User not found');
    return user;
};

const getDashboardStats = async () => {
    // Use UTC time to avoid timezone mismatches with MongoDB aggregation
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - 6); // Include today, so 7 days total
    const prev7Days = new Date(today);
    prev7Days.setDate(today.getDate() - 13);

    // 1. Users Trend
    const currentUsers = await User.countDocuments({ createdAt: { $gte: last7Days } });
    const prevUsers = await User.countDocuments({ createdAt: { $gte: prev7Days, $lt: last7Days } });
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const usersTrend = prevUsers === 0 ? (currentUsers > 0 ? 100 : 0) : ((currentUsers - prevUsers) / prevUsers) * 100;

    // 2. Orders Trend
    const currentOrders = await Order.countDocuments({ createdAt: { $gte: last7Days } });
    const prevOrders = await Order.countDocuments({ createdAt: { $gte: prev7Days, $lt: last7Days } });
    const totalOrders = await Order.countDocuments();
    const ordersTrend = prevOrders === 0 ? (currentOrders > 0 ? 100 : 0) : ((currentOrders - prevOrders) / prevOrders) * 100;

    // 3. Revenue Trend
    const currentRevData = await Order.aggregate([
        { $match: { paymentStatus: 'paid', createdAt: { $gte: last7Days } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const prevRevData = await Order.aggregate([
        { $match: { paymentStatus: 'paid', createdAt: { $gte: prev7Days, $lt: last7Days } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevData = await Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const currentRev = currentRevData[0]?.total || 0;
    const prevRev = prevRevData[0]?.total || 0;
    const totalRevenue = totalRevData[0]?.total || 0;
    const revenueTrend = prevRev === 0 ? (currentRev > 0 ? 100 : 0) : ((currentRev - prevRev) / prevRev) * 100;

    // 4. Daily Revenue for Chart (Last 7 days) - Timezone safe
    const dailyRevenueData = await Order.aggregate([
        { $match: { paymentStatus: 'paid', createdAt: { $gte: last7Days } } },
        { 
            $group: { 
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "UTC" } }, 
                total: { $sum: '$totalPrice' } 
            } 
        },
        { $sort: { _id: 1 } }
    ]);
    
    // Format daily revenue to ensure all 7 days are present
    const dailyRevenue = [];
    for(let i=6; i>=0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const found = dailyRevenueData.find(item => item._id === dateStr);
        dailyRevenue.push({ 
            date: d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }), 
            revenue: found ? found.total : 0 
        });
    }

    // 5. Low Stock & Pending Prescriptions
    const lowStockMedicines = await Medicine.find({ stock: { $lt: 10 } }).select('name stock manufacturer');
    const pendingPrescriptions = await Prescription.countDocuments({ status: 'pending' });

    // 6. Recent Successful Orders (Strictly Delivered)
    const recentOrders = await Order.find({ paymentStatus: 'paid', orderStatus: 'delivered' })
        .populate('userId', 'name')
        .sort({ updatedAt: -1 }) // Sort by updatedAt in case delivery happened later
        .limit(5)
        .select('updatedAt userId orderStatus medicines totalPrice');

    return {
        totalUsers,
        usersTrend: usersTrend.toFixed(1),
        totalOrders,
        ordersTrend: ordersTrend.toFixed(1),
        totalRevenue,
        revenueTrend: revenueTrend.toFixed(1),
        dailyRevenue,
        pendingPrescriptions,
        lowStockMedicines,
        recentOrders
    };
};

module.exports = {
    getDashboardStats,
    getAllUsers,
    updateUserRole,
};