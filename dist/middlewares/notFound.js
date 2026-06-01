"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const ApiError_1 = require("../utils/ApiError");
const notFoundHandler = (req, res, next) => {
    next(new ApiError_1.ApiError(404, `Route not found: ${req.originalUrl}`));
};
exports.notFoundHandler = notFoundHandler;
