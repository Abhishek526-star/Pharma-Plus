const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate.middleware');
const { verifyJWT, authorizeRoles } = require('../middleware/auth.middleware');
const { uploadImage } = require('../middleware/upload.middleware'); // <-- MUST BE uploadImage
const { create, getAll, getById, update, remove ,restock} = require('../controllers/medicine.controller');

const router = express.Router();

// Public Routes
router.get('/', getAll);
router.get('/:id', getById);

// Admin Routes
router.post(
    '/',
    verifyJWT,
    authorizeRoles('admin'),
    uploadImage.single('image'), // <-- MUST BE uploadImage
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('description').trim().notEmpty().withMessage('Description is required'),
        body('price').isNumeric().withMessage('Price must be a number'),
        body('category').notEmpty().withMessage('Category ID is required'),
        body('manufacturer').trim().notEmpty().withMessage('Manufacturer is required'),
        body('stock').isNumeric().withMessage('Stock must be a number'),
        body('expiryDate').notEmpty().withMessage('Expiry date is required'),
    ],
    validate,
    create
);

router.put(
    '/:id',
    verifyJWT,
    authorizeRoles('admin', 'pharmacist'),
    uploadImage.single('image'), // <-- MUST BE uploadImage
    update
);

router.delete('/:id', verifyJWT, authorizeRoles('admin'), remove);
router.put('/:id/restock', verifyJWT, authorizeRoles('admin', 'pharmacist'), restock);
module.exports = router;