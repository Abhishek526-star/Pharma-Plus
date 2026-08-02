const ApiError = require('../utils/ApiError');
const multer = require('multer'); // Add this import

const errorHandler = (err, req, res, next) => {
    let error = err;

    // Handle Multer Errors specifically
    if (err instanceof multer.MulterError) {
        let message = 'File upload error';
        if (err.code === 'LIMIT_FILE_SIZE') {
            message = 'File size is too large. Maximum allowed is 10MB.';
        }
        error = new ApiError(400, message);
    } else if (err.message === 'Only image and PDF files are allowed!' || err.message === 'Only image files are allowed!') {
        // Handle custom file filter errors
        error = new ApiError(400, err.message);
    }

    // Handle Mongoose Bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid: ${err.path}`;
        error = new ApiError(404, message);
    }

    // Handle Mongoose Duplicate Key Error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `Duplicate field value entered for ${field}. Please use another value.`;
        error = new ApiError(409, message);
    }

    // Handle Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message).join(', ');
        error = new ApiError(400, message);
    }

    // If it's not already an ApiError, wrap it
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        error = new ApiError(statusCode, message, error?.errors || [], err.stack);
    }

    const response = {
        success: false,
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    };

    return res.status(error.statusCode).json(response);
};

const notFound = (req, res, next) => {
    const error = new ApiError(404, `Route not found: ${req.originalUrl}`);
    next(error);
};

module.exports = {
    errorHandler,
    notFound,
};