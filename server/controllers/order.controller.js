const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { createOrder, getUserOrders, getAllOrders, updateOrderStatus } = require('../services/order.service');

const create = asyncHandler(async (req, res) => {
    const { deliveryAddress } = req.body;
    if (!deliveryAddress) throw new ApiError(400, 'Delivery address is required');
    const order = await createOrder(req.user._id, deliveryAddress);
    return res.status(201).json(new ApiResponse(201, order, 'Order created successfully'));
});

const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await getUserOrders(req.user._id);
    return res.status(200).json(new ApiResponse(200, orders, 'Orders fetched successfully'));
});

const getAll = asyncHandler(async (req, res) => {
    const orders = await getAllOrders();
    return res.status(200).json(new ApiResponse(200, orders, 'All orders fetched successfully'));
});

const updateStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const order = await updateOrderStatus(req.params.id, status);
    return res.status(200).json(new ApiResponse(200, order, 'Order status updated'));
});

module.exports = { create, getMyOrders, getAll, updateStatus };