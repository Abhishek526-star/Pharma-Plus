const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { uploadPrescription, getUserPrescriptions, getAllPrescriptions, verifyPrescription, deletePrescription } = require('../services/prescription.service');

const upload = asyncHandler(async (req, res) => {
  

    if (!req.user?._id) throw new ApiError(401, 'Unauthorized');
    const prescription = await uploadPrescription(req.user._id, req.file);
    
    return res.status(201).json(new ApiResponse(201, prescription, 'Prescription uploaded successfully'));
});


const getMyPrescriptions = asyncHandler(async (req, res) => {
    if (!req.user?._id) throw new ApiError(401, 'Unauthorized');
    const prescriptions = await getUserPrescriptions(req.user._id);
    return res.status(200).json(new ApiResponse(200, prescriptions, 'Prescriptions fetched successfully'));
});

const getAll = asyncHandler(async (req, res) => {
    const prescriptions = await getAllPrescriptions(req.query.status);
    return res.status(200).json(new ApiResponse(200, prescriptions, 'All prescriptions fetched successfully'));
});

const updateStatus = asyncHandler(async (req, res) => {
    const { status, remarks } = req.body;
    const prescription = await verifyPrescription(req.params.id, req.user._id, status, remarks);
    return res.status(200).json(new ApiResponse(200, prescription, 'Prescription status updated'));
});

const remove = asyncHandler(async (req, res) => {
    await deletePrescription(req.params.id, req.user._id, req.user.role);
    return res.status(200).json(new ApiResponse(200, {}, 'Prescription deleted successfully'));
});


module.exports = { upload, getMyPrescriptions, getAll, updateStatus , remove };