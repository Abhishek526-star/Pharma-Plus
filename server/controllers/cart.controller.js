const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { getCart, addItemToCart, updateCartItemQuantity, removeItemFromCart } = require('../services/cart.service');

const getUserCart = asyncHandler(async (req, res) => {
    const cart = await getCart(req.user._id);
    return res.status(200).json(new ApiResponse(200, cart, 'Cart fetched successfully'));
});

const addToCart = asyncHandler(async (req, res) => {
    const { medicineId, quantity = 1 } = req.body;
    const cart = await addItemToCart(req.user._id, medicineId, quantity);
    return res.status(200).json(new ApiResponse(200, cart, 'Item added to cart'));
});

const updateCart = asyncHandler(async (req, res) => {
    const { medicineId, quantity } = req.body;
    const cart = await updateCartItemQuantity(req.user._id, medicineId, quantity);
    return res.status(200).json(new ApiResponse(200, cart, 'Cart updated successfully'));
});

const removeFromCart = asyncHandler(async (req, res) => {
    const cart = await removeItemFromCart(req.user._id, req.params.medicineId);
    return res.status(200).json(new ApiResponse(200, cart, 'Item removed from cart'));
});

module.exports = {
    getUserCart,
    addToCart,
    updateCart,
    removeFromCart,
};