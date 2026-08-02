const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

const registerUser = async (userData) => {
    const { name, email, password, phone } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, 'Email is already registered');
    }

    const user = await User.create({ name, email, password, phone });
    const createdUser = await User.findById(user._id).select('-password -refreshToken');

    if (!createdUser) {
        throw new ApiError(500, 'Something went wrong while registering the user');
    }

    return createdUser;
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new ApiError(404, 'User not found. Please register.');
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid user credentials');
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

    return { user: loggedInUser, accessToken, refreshToken };
};

const refreshAccessToken = async (incomingRefreshToken) => {
    if (!incomingRefreshToken) {
        throw new ApiError(401, 'Unauthorized request. Refresh token missing.');
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decodedToken._id);

        if (!user || incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, 'Invalid or expired refresh token');
        }

        const newAccessToken = generateAccessToken(user._id, user.role);
        return { accessToken: newAccessToken };
    } catch (error) {
        throw new ApiError(401, 'Invalid or expired refresh token');
    }
};

const logoutUser = async (userId) => {
    await User.findByIdAndUpdate(
        userId,
        { $unset: { refreshToken: 1 } },
        { returnDocument: "after" }
    );
};

const updateUserProfile = async (userId, updateData) => {
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                name: updateData.name,
                phone: updateData.phone,
                address: updateData.address
            }
        },
        { returnDocument: "after", runValidators: true }
    ).select('-password -refreshToken');

    if (!updatedUser) throw new ApiError(404, 'User not found');
    return updatedUser;
};

const changeUserPassword = async (userId, oldPassword, newPassword) => {
    const user = await User.findById(userId).select('+password');
    if (!user) throw new ApiError(404, 'User not found');

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordValid) throw new ApiError(401, 'Old password is incorrect');

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
};

module.exports = {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    updateUserProfile,
    changeUserPassword,
};