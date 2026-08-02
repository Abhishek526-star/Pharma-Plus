const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { createReview, getMedicineReviews, deleteReview } = require('../services/review.service');

const addReview = asyncHandler(async (req, res) => {
    const { medicineId, rating, comment } = req.body;
    const review = await createReview(req.user._id, medicineId, rating, comment);
    return res.status(201).json(new ApiResponse(201, review, 'Review added successfully'));
});

const getReviews = asyncHandler(async (req, res) => {
    const { reviews, avgRating, count } = await getMedicineReviews(req.params.medicineId);
    return res.status(200).json(new ApiResponse(200, { reviews, avgRating, count }, 'Reviews fetched successfully'));
});

const removeReview = asyncHandler(async (req, res) => {
    await deleteReview(req.params.id, req.user._id);
    return res.status(200).json(new ApiResponse(200, {}, 'Review deleted successfully'));
});

module.exports = { addReview, getReviews, removeReview };