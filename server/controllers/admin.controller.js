const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { getDashboardStats, getAllUsers, updateUserRole } = require('../services/admin.service');

const getStats = asyncHandler(async (req, res) => {
    const stats = await getDashboardStats();
    return res.status(200).json(new ApiResponse(200, stats, 'Dashboard stats fetched successfully'));
});

const getUsers = asyncHandler(async (req, res) => {
    const users = await getAllUsers();
    return res.status(200).json(new ApiResponse(200, users, 'Users fetched successfully'));
});

const updateRole = asyncHandler(async (req, res) => {
    const { role } = req.body;
    if (!['customer', 'admin', 'pharmacist'].includes(role)) {
        throw new ApiError(400, 'Invalid role specified');
    }
    const user = await updateUserRole(req.params.id, role);
    return res.status(200).json(new ApiResponse(200, user, 'User role updated successfully'));
});

module.exports = { getStats, getUsers, updateRole };