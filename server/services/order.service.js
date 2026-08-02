const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Payment = require('../models/Payment');
const ApiError = require('../utils/ApiError');

const createOrder = async (userId, deliveryAddress, phone) => {
    const cart = await Cart.findOne({ userId }).populate('items.medicineId');
    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, 'Your cart is empty');
    }

    const medicines = cart.items.map(item => ({
        medicineId: item.medicineId._id,
        name: item.medicineId.name,
        price: item.medicineId.price,
        quantity: item.quantity,
    }));

    const totalPrice = medicines.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const order = await Order.create({
        userId,
        medicines,
        totalPrice,
        deliveryAddress,
        paymentStatus: 'pending',
        orderStatus: 'processing',
    });

    return order;
};

const getUserOrders = async (userId) => {
    return await Order.find({ userId }).sort({ createdAt: -1 });
};

const getAllOrders = async () => {
    return await Order.find()
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });
};

const updateOrderStatus = async (orderId, status) => {
    const order = await Order.findByIdAndUpdate(orderId, { orderStatus: status }, { returnDocument: "after" });
    if (!order) throw new ApiError(404, 'Order not found');
    return order;
};

module.exports = {
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
};