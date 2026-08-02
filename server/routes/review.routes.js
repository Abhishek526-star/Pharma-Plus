const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate.middleware');
const { verifyJWT } = require('../middleware/auth.middleware');
const { addReview, getReviews, removeReview } = require('../controllers/review.controller');

const router = express.Router();

// Public route to view reviews
router.get('/:medicineId', getReviews);

// Protected routes
router.use(verifyJWT);
router.post(
    '/',
    [
        body('medicineId').notEmpty().withMessage('Medicine ID is required'),
        body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
        body('comment').optional().isString(),
    ],
    validate,
    addReview
);
router.delete('/:id', removeReview);

module.exports = router;