const Medicine = require('../models/Medicine');
const ApiError = require('../utils/ApiError');

const createMedicine = async (data) => {
    const medicine = await Medicine.create(data);
    return medicine;
};

const getAllMedicines = async (queryParams) => {
    const { search, category, minPrice, maxPrice, availability, sort } = queryParams;
    
    // Build Query Filters
    const filters = {};
    if (search) {
        filters.$or = [
            { name: { $regex: search, $options: 'i' } },
            { manufacturer: { $regex: search, $options: 'i' } }
        ];
    }
    if (category) filters.category = category;
    if (minPrice || maxPrice) {
        filters.price = {};
        if (minPrice) filters.price.$gte = Number(minPrice);
        if (maxPrice) filters.price.$lte = Number(maxPrice);
    }
    if (availability === 'in-stock') filters.stock = { $gt: 0 };

    // Build Sorting
    let sortOptions = { createdAt: -1 }; // Default sort
    if (sort === 'price-asc') sortOptions = { price: 1 };
    if (sort === 'price-desc') sortOptions = { price: -1 };
    if (sort === 'name-asc') sortOptions = { name: 1 };

    const medicines = await Medicine.find(filters)
        .populate('category', 'name')
        .sort(sortOptions);

    return medicines;
};

const getMedicineById = async (id) => {
    const medicine = await Medicine.findById(id).populate('category', 'name');
    if (!medicine) throw new ApiError(404, 'Medicine not found');
    return medicine;
};

const updateMedicine = async (id, data) => {
    const medicine = await Medicine.findByIdAndUpdate(id, data, { returnDocument: "after", runValidators: true });
    if (!medicine) throw new ApiError(404, 'Medicine not found');
    return medicine;
};

const deleteMedicine = async (id) => {
    const medicine = await Medicine.findByIdAndDelete(id);
    if (!medicine) throw new ApiError(404, 'Medicine not found');
    return medicine;
};


const restockMedicine = async (id, additionalStock) => {
    if (additionalStock <= 0) throw new ApiError(400, 'Additional stock must be greater than 0');
    
    const medicine = await Medicine.findById(id);
    if (!medicine) throw new ApiError(404, 'Medicine not found');
    
    medicine.stock += Number(additionalStock);
    await medicine.save();
    
    return medicine;
};
module.exports = {
    createMedicine,
    getAllMedicines,
    getMedicineById,
    updateMedicine,
    deleteMedicine,
    restockMedicine
};