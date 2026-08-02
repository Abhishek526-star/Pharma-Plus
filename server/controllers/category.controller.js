const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { createCategory, getAllCategories, updateCategory, deleteCategory } = require('../services/category.service');

const create = asyncHandler(async (req, res) => {
    const category = await createCategory(req.body);
    return res.status(201).json(new ApiResponse(201, category, 'Category created successfully'));
});

const getAll = asyncHandler(async (req, res) => {
    const categories = await getAllCategories();
    return res.status(200).json(new ApiResponse(200, categories, 'Categories fetched successfully'));
});

const update = asyncHandler(async (req, res) => {
    const category = await updateCategory(req.params.id, req.body);
    return res.status(200).json(new ApiResponse(200, category, 'Category updated successfully'));
});

const remove = asyncHandler(async (req, res) => {
    await deleteCategory(req.params.id);
    return res.status(200).json(new ApiResponse(200, {}, 'Category deleted successfully'));
});

module.exports = { create, getAll, update, remove };