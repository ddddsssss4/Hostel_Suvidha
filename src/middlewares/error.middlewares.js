import { ApiError } from "../utils/ApiError.js";
const errorHandler = (err, req, res, next) => {
    // If the error is an instance of ApiError, use its properties
    if (err instanceof ApiError) {
        return res.status(err.statusCode || 500).json({
            success: err.success,
            message: err.message,
            errors: err.errors,
            data: err.data,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack,  // Hide stack trace in production
        });
    }

    // Handle any other unknown errors
    return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        errors: [],
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export default errorHandler;
