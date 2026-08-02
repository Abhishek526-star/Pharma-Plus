const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const {
    createRazorpayOrder,
    verifyRazorpayPayment,
} = require("../services/payment.service");

/**
 * Create Razorpay Order
 */
const createOrder = asyncHandler(async (req, res) => {

    const { orderId } = req.body;

    if (!orderId) {
        throw new ApiError(400, "Order ID is required");
    }

    const data = await createRazorpayOrder(
        orderId,
        req.user._id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            data,
            "Razorpay order created successfully"
        )
    );
});

/**
 * Verify Razorpay Payment
 */
const verifyPayment = asyncHandler(async (req, res) => {

    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderId,
    } = req.body;

    if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !orderId
    ) {
        throw new ApiError(
            400,
            "Missing payment details"
        );
    }

    const result = await verifyRazorpayPayment(
        req.body,
        req.user._id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            result,
            "Payment verified successfully"
        )
    );
});

module.exports = {
    createOrder,
    verifyPayment,
};