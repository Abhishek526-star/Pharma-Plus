const Prescription = require('../models/Prescription');
const ApiError = require('../utils/ApiError');
const uploadToCloudinary = require('../utils/cloudinary');

const uploadPrescription = async (userId, file) => {
    if (!file) throw new ApiError(400, 'Prescription file is required');
    
    const uploadResult = await uploadToCloudinary(file, 'prescriptions');
    
    // Safety check: if Cloudinary failed to return a secure URL, throw an error
    if (!uploadResult || !uploadResult.secure_url) {
        console.error("Missing secure_url in Cloudinary response:", uploadResult);
        throw new ApiError(500, 'Cloudinary did not return a valid file URL');
    }
    
    const fileUrl = `${uploadResult.secure_url}?inline=true`;

    const prescription = await Prescription.create({
        userId,
        file: fileUrl,
        status: 'pending',
    });

    

    return prescription;
};


const getUserPrescriptions = async (userId) => {
    return await Prescription.find({ userId }).sort({ createdAt: -1 });
};

const getAllPrescriptions = async (status) => {
    const filter = status ? { status } : {};
    
    return await Prescription.find(filter)
        .populate('userId', 'name email')
        .populate('verifiedBy', 'name')
        .sort({ createdAt: -1 });
};

const verifyPrescription = async (prescriptionId, pharmacistId, status, remarks) => {
    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) throw new ApiError(404, 'Prescription not found');

    prescription.status = status;
    prescription.verifiedBy = pharmacistId;
    prescription.remarks = remarks || '';
    
    await prescription.save();
    return prescription;
};

//delete prescription
const deletePrescription = async (prescriptionId, userId, role) => {
    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) throw new ApiError(404, 'Prescription not found');
    if (prescription.userId.toString() !== userId.toString() && role !== 'admin') throw new ApiError(403, 'Not authorized to delete this prescription');
    await prescription.deleteOne();
};


module.exports = {
    uploadPrescription,
    getUserPrescriptions,
    getAllPrescriptions,
    verifyPrescription,
    deletePrescription

};