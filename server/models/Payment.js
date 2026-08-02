const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
        default: 'razorpay',
    },
    transactionId: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        required: true,
        default: 'pending',
    },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);