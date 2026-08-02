const cloudinary = require('../config/cloudinary');
const ApiError = require('../utils/ApiError');

const uploadToCloudinary = async (file, folderName) => {
    try {
        // Convert buffer to base64 Data URI
        const base64File = file.buffer.toString('base64');
        const dataUri = `data:${file.mimetype};base64,${base64File}`;

        const result = await cloudinary.uploader.upload(dataUri, {
            folder: folderName,
            resource_type: 'auto',
        });

        return result;
    } catch (error) {
        // This will print the EXACT reason why Cloudinary rejected the upload
        console.error("CLOUDINARY REJECTION ERROR:", error); 
        throw new ApiError(500, 'Failed to upload file to Cloudinary');
    }
};

module.exports = uploadToCloudinary;