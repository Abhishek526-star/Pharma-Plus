const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');

const createCategory = async (data) => {
    const category = await Category.create(data);
    return category;
};

const getAllCategories = async () => {
    const categories = await Category.find().sort({ name: 1 });
    return categories;
};

const updateCategory = async (categoryId, data) => {
    const category = await Category.findByIdAndUpdate(categoryId, data, { returnDocument: "after", runValidators: true });
    if (!category) throw new ApiError(404, 'Category not found');
    return category;
};

const deleteCategory = async (categoryId) => {
    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) throw new ApiError(404, 'Category not found');
    return category;
};

module.exports = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
};