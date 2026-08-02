const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { 
    registerUser, 
    loginUser, 
    refreshAccessToken, 
    logoutUser, 
    updateUserProfile, 
    changeUserPassword 
} = require('../services/auth.service');

const register = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone) {
        throw new ApiError(400, 'All fields are required');
    }
    const user = await registerUser({ name, email, password, phone });
    return res.status(201).json(new ApiResponse(201, user, 'User registered successfully'));
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, 'Email and password are required');
    }
    const { user, accessToken, refreshToken } = await loginUser(email, password);
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    };
    return res.status(200)
        .cookie('refreshToken', refreshToken, options)
        .json(new ApiResponse(200, { user, accessToken }, 'User logged in successfully'));
});

const refresh = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    const { accessToken } = await refreshAccessToken(incomingRefreshToken);
    return res.status(200).json(new ApiResponse(200, { accessToken }, 'Access token refreshed successfully'));
});

const logout = asyncHandler(async (req, res) => {
    await logoutUser(req.user._id);
    const options = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' };
    return res.status(200).clearCookie('refreshToken', options).json(new ApiResponse(200, {}, 'User logged out successfully'));
});

const getProfile = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, 'User profile fetched successfully'));
});

const updateProfile = asyncHandler(async (req, res) => {
    const updatedUser = await updateUserProfile(req.user._id, req.body);
    return res.status(200).json(new ApiResponse(200, updatedUser, 'Profile updated successfully'));
});

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) throw new ApiError(400, 'Old and new passwords are required');
    await changeUserPassword(req.user._id, oldPassword, newPassword);
    return res.status(200).json(new ApiResponse(200, {}, 'Password changed successfully'));
});

module.exports = {
    register,
    login,
    refresh,
    logout,
    getProfile,
    updateProfile,
    changePassword,
};