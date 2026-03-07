import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
    logger.error(`${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}\nStack: ${err.stack}`);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
};
