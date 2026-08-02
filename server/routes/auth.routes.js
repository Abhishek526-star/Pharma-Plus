const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate.middleware');
const { verifyJWT } = require('../middleware/auth.middleware');
const { register, login, refresh, logout, getProfile, updateProfile, changePassword } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
], validate, register);

router.post('/login', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
], validate, login);

router.post('/refresh-token', refresh);
router.post('/logout', verifyJWT, logout);
router.get('/profile', verifyJWT, getProfile);

// New Routes for Profile update and Password change
router.put('/profile', verifyJWT, updateProfile);
router.put('/change-password', [
    body('oldPassword').notEmpty().withMessage('Old password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
], validate, verifyJWT, changePassword);

module.exports = router;