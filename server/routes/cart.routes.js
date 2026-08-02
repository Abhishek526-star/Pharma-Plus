const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate.middleware');
const { verifyJWT } = require('../middleware/auth.middleware');
const { getUserCart, addToCart, updateCart, removeFromCart } = require('../controllers/cart.controller');

const router = express.Router();

router.use(verifyJWT); // All cart routes require authentication

router.get('/', getUserCart);

router.post(
    '/',
    [
        body('medicineId').notEmpty().withMessage('Medicine ID is required'),
        body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    ],
    validate,
    addToCart
);

router.put(
    '/',
    [
        body('medicineId').notEmpty().withMessage('Medicine ID is required'),
        body('quantity').isInt({ min: 0 }).withMessage('Quantity must be 0 or greater'),
    ],
    validate,
    updateCart
);

router.delete('/:medicineId', removeFromCart);

module.exports = router;