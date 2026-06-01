"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const ApiError_1 = require("../utils/ApiError");
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        next(err);
        return;
    }
    const statusCode = err instanceof ApiError_1.ApiError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    res.status(statusCode).json({
        status: 'error',
        message,
    });
};
exports.errorHandler = errorHandler;
