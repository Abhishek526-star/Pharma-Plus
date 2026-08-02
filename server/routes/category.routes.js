const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate.middleware');
const { verifyJWT, authorizeRoles } = require('../middleware/auth.middleware');
const { create, getAll, update, remove } = require('../controllers/category.controller');

const router = express.Router();

router.get('/', getAll);

router.post(
    '/',
    verifyJWT,
    authorizeRoles('admin'),
    [body('name').trim().notEmpty().withMessage('Category name is required')],
    validate,
    create
);

router.put('/:id', verifyJWT, authorizeRoles('admin'), update);
router.delete('/:id', verifyJWT, authorizeRoles('admin'), remove);

module.exports = router;