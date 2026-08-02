const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Payment = require("../models/Payment");
const Cart = require("../models/Cart");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const Medicine = require('../models/Medicine'); // Import Medicine model



/**
 * Create Razorpay Order
 */
const createRazorpayOrder = async (orderId, userId) => {
    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.userId.toString() !== userId.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    if (!order.totalPrice || order.totalPrice <= 0) {
        throw new ApiError(400, "Invalid order amount");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const options = {
        amount: Math.round(order.totalPrice * 100),
        currency: "INR",
        receipt: order._id.toString(),
    };

    let razorpayOrder;

    try {
        razorpayOrder = await razorpay.orders.create(options);

        await Order.findByIdAndUpdate(orderId, {
            razorpayOrderId: razorpayOrder.id,
        });

    } catch (err) {
        console.error("Razorpay Order Error:", err);

        throw new ApiError(
            500,
            err.error?.description ||
            err.message ||
            "Unable to create Razorpay order"
        );
    }

    return {
        success: true,
        key_id: process.env.RAZORPAY_KEY_ID,

        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,

        orderId: order._id,

        user: {
            name: user.name,
            email: user.email,
            phone: user.phone,
        },
    };
};

/**
 * Verify Payment
 */

const verifyRazorpayPayment = async (paymentData, userId) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = paymentData;
    const session = await mongoose.startSession();
    
    try {
        session.startTransaction();

        // 1. Validate Signature
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(sign)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            throw new ApiError(400, 'Payment verification failed: Invalid signature');
        }

        // 2. Fetch Order (within session)
        const order = await Order.findById(orderId).session(session);
        if (!order) throw new ApiError(404, 'Order not found');

        // 3. Prevent Duplicate Deductions (Idempotency)
        if (order.paymentStatus === 'paid') {
            console.log(`[Inventory] Order ${orderId} is already paid. Skipping duplicate inventory update.`);
            await session.abortTransaction();
            return { success: true, message: 'Order already processed' };
        }

        console.log(`[Inventory] Starting stock reduction for Order: ${orderId}`);

        // 4. Validate & Reduce Stock
        for (const item of order.medicines) {
            const medicine = await Medicine.findById(item.medicineId).session(session);
            
            if (!medicine) {
                throw new ApiError(404, `Medicine not found: ${item.name}`);
            }
            
            if (medicine.stock < item.quantity) {
                throw new ApiError(400, `Insufficient stock for ${medicine.name}. Available: ${medicine.stock}, Requested: ${item.quantity}`);
            }

            medicine.stock -= item.quantity;
            await medicine.save({ session });
            console.log(`[Inventory] Reduced stock for ${medicine.name} by ${item.quantity}. New stock: ${medicine.stock}`);
        }

        // 5. Update Order Status
        order.paymentStatus = 'paid';
        order.orderStatus = 'packed';
        await order.save({ session });

        // 6. Create Payment Record
        await Payment.create([{
            orderId: order._id,
            paymentMethod: 'razorpay',
            transactionId: razorpay_payment_id,
            status: 'success',
        }], { session });

        // 7. Clear User's Cart
        await Cart.findOneAndUpdate({ userId }, { items: [] }).session(session);

        // Commit the transaction
        await session.commitTransaction();
        console.log(`[Inventory] Transaction committed successfully for Order: ${orderId}`);
        
        return { success: true };
    } catch (error) {
        // If any error occurs, abort the transaction and rollback all changes
        await session.abortTransaction();
        console.error(`[Inventory] Transaction failed for Order ${orderId}:`, error.message);
        throw error;
    } finally {
        session.endSession();
    }
};

module.exports = {
    createRazorpayOrder,
    verifyRazorpayPayment,
};