const express = require('express');
const { verifyJWT } = require('../middleware/auth.middleware');
const { createOrder, verifyPayment } = require('../controllers/payment.controller');

const router = express.Router();

router.post('/create-order', verifyJWT, createOrder);
router.post('/verify', verifyJWT, verifyPayment);

module.exports = router;