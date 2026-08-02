const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate.middleware');
const { verifyJWT, authorizeRoles } = require('../middleware/auth.middleware');
const { create, getMyOrders, getAll, updateStatus } = require('../controllers/order.controller');

const router = express.Router();

router.use(verifyJWT);

router.post('/', [body('deliveryAddress').notEmpty()], validate, create);
router.get('/my-orders', getMyOrders);

router.get('/', authorizeRoles('admin', 'pharmacist'), getAll);
router.put('/:id', authorizeRoles('admin', 'pharmacist'), updateStatus);

module.exports = router;