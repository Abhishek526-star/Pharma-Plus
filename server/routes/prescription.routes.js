const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate.middleware');
const { verifyJWT, authorizeRoles } = require('../middleware/auth.middleware');
const { uploadPrescription } = require('../middleware/upload.middleware');
const { upload, getMyPrescriptions, getAll, updateStatus, remove } = require('../controllers/prescription.controller');

const router = express.Router();

router.use(verifyJWT); // All prescription routes require auth

// Customer routes
router.post('/upload', uploadPrescription.single('file'), upload);
router.get('/me', getMyPrescriptions);
router.delete('/:id', remove); // Make sure this line exists!


// Pharmacist/Admin routes
router.get('/', authorizeRoles('pharmacist', 'admin'), getAll);
router.put(
    '/:id',
    authorizeRoles('pharmacist', 'admin'),
    [
        body('status').isIn(['verified', 'rejected']).withMessage('Status must be verified or rejected'),
    ],
    validate,
    updateStatus
);

module.exports = router;