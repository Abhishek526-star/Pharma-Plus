const Review = require('../models/Review');
const ApiError = require('../utils/ApiError');

const createReview = async (userId, medicineId, rating, comment) => {
    const existingReview = await Review.findOne({ userId, medicineId });
    if (existingReview) throw new ApiError(400, 'You have already reviewed this medicine');

    const review = await Review.create({ userId, medicineId, rating, comment });
    return review;
};

const getMedicineReviews = async (medicineId) => {
    const reviews = await Review.find({ medicineId })
        .populate('userId', 'name')
        .sort({ createdAt: -1 });
        
    const avgRating = reviews.length > 0 
        ? reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length 
        : 0;

    return { reviews, avgRating, count: reviews.length };
};

const deleteReview = async (reviewId, userId) => {
    const review = await Review.findById(reviewId);
    if (!review) throw new ApiError(404, 'Review not found');
    if (review.userId.toString() !== userId.toString()) throw new ApiError(403, 'Not authorized to delete this review');
    
    await review.deleteOne();
};

module.exports = { createReview, getMedicineReviews, deleteReview };