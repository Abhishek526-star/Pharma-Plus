const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    file: {
        type: String, // Cloudinary secure URL
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending',
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Pharmacist/Admin
    },
    remarks: {
        type: String,
        default: '',
    },
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);