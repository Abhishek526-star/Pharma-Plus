const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate.middleware');
const { verifyJWT, authorizeRoles } = require('../middleware/auth.middleware');
const { getStats, getUsers, updateRole } = require('../controllers/admin.controller');

const router = express.Router();

router.use(verifyJWT, authorizeRoles('admin')); // All routes in this file are Admin-only

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/role', [body('role').notEmpty()], validate, updateRole);

module.exports = router;