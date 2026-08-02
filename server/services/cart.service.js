const Cart = require('../models/Cart');
const Medicine = require('../models/Medicine');
const ApiError = require('../utils/ApiError');

const getCart = async (userId) => {
    const cart = await Cart.findOne({ userId }).populate('items.medicineId');
    return cart || await Cart.create({ userId, items: [] });
};

const addItemToCart = async (userId, medicineId, quantity) => {
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) throw new ApiError(404, 'Medicine not found');
    if (medicine.stock < quantity) throw new ApiError(400, 'Insufficient stock');

    let cart = await Cart.findOne({ userId });
    if (!cart) {
        cart = await Cart.create({ userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
        (item) => item.medicineId.toString() === medicineId
    );

    if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
    } else {
        cart.items.push({ medicineId, quantity });
    }

    await cart.save();
    return cart.populate('items.medicineId');
};

const updateCartItemQuantity = async (userId, medicineId, quantity) => {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new ApiError(404, 'Cart not found');

    const itemIndex = cart.items.findIndex(
        (item) => item.medicineId.toString() === medicineId
    );

    if (itemIndex === -1) throw new ApiError(404, 'Item not found in cart');

    if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
    } else {
        cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    return cart.populate('items.medicineId');
};

const removeItemFromCart = async (userId, medicineId) => {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new ApiError(404, 'Cart not found');

    cart.items = cart.items.filter(
        (item) => item.medicineId.toString() !== medicineId
    );

    await cart.save();
    return cart.populate('items.medicineId');
};

const clearCart = async (userId) => {
    await Cart.findOneAndUpdate({ userId }, { items: [] });
};

module.exports = {
    getCart,
    addItemToCart,
    updateCartItemQuantity,
    removeItemFromCart,
    clearCart,
};