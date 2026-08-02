const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const uploadToCloudinary = require('../utils/cloudinary');
const { createMedicine, getAllMedicines, getMedicineById, updateMedicine, deleteMedicine, restockMedicine } = require('../services/medicine.service');

const create = asyncHandler(async (req, res) => {
    let imageData = {};
    if (req.file) {
    const uploadResult = await uploadToCloudinary(req.file, 'medicines');        
    imageData.image = uploadResult.secure_url;
    }

    const medicineData = {
        ...req.body,
        price: Number(req.body.price),
        stock: Number(req.body.stock),
        requiresPrescription: req.body.requiresPrescription === 'true' || req.body.requiresPrescription === true,
        expiryDate: new Date(req.body.expiryDate),
        image: imageData.image || ''
    };

    const medicine = await createMedicine(medicineData);
    return res.status(201).json(new ApiResponse(201, medicine, 'Medicine created successfully'));
});

const getAll = asyncHandler(async (req, res) => {
    const medicines = await getAllMedicines(req.query);
    return res.status(200).json(new ApiResponse(200, medicines, 'Medicines fetched successfully'));
});

const getById = asyncHandler(async (req, res) => {
    const medicine = await getMedicineById(req.params.id);
    return res.status(200).json(new ApiResponse(200, medicine, 'Medicine fetched successfully'));
});

const update = asyncHandler(async (req, res) => {
    let updateData = { ...req.body };
    
    if (req.body.price) updateData.price = Number(req.body.price);
    if (req.body.stock) updateData.stock = Number(req.body.stock);
    if (req.body.requiresPrescription) {
        updateData.requiresPrescription = req.body.requiresPrescription === 'true' || req.body.requiresPrescription === true;
    }
    if (req.body.expiryDate) updateData.expiryDate = new Date(req.body.expiryDate);

    if (req.file) {
        const uploadResult = await uploadToCloudinary(req.file, 'medicines');
        updateData.image = uploadResult.secure_url;
    }

    const medicine = await updateMedicine(req.params.id, updateData);
    return res.status(200).json(new ApiResponse(200, medicine, 'Medicine updated successfully'));
});

const remove = asyncHandler(async (req, res) => {
    await deleteMedicine(req.params.id);
    return res.status(200).json(new ApiResponse(200, {}, 'Medicine deleted successfully'));
});

const restock = asyncHandler(async (req, res) => {
    const { additionalStock } = req.body;
    if (!additionalStock) throw new ApiError(400, 'Additional stock amount is required');
    const medicine = await restockMedicine(req.params.id, additionalStock);
    return res.status(200).json(new ApiResponse(200, medicine, 'Stock updated successfully'));
});

module.exports = { create, getAll, getById, update, remove, restock };