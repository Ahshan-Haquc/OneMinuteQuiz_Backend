"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAccessPermission = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema_1 = __importDefault(require("../models/userSchema"));
const ApiError_1 = require("../utils/ApiError");
const validateEnv_1 = require("../config/validateEnv");
const userAccessPermission = async (req, res, next) => {
    try {
        const cookieToken = req.cookies?.userCookie;
        if (!cookieToken || typeof cookieToken !== 'string') {
            throw new ApiError_1.ApiError(401, 'Unauthorized access');
        }
        const payload = jsonwebtoken_1.default.verify(cookieToken, validateEnv_1.env.JWT_SECRET);
        if (!payload?._id) {
            throw new ApiError_1.ApiError(401, 'Unauthorized access');
        }
        const user = await userSchema_1.default.findById(payload._id);
        if (!user) {
            throw new ApiError_1.ApiError(401, 'Unauthorized access');
        }
        const authReq = req;
        authReq.token = cookieToken;
        authReq.userInfo = user;
        next();
    }
    catch (error) {
        next(new ApiError_1.ApiError(401, 'Unauthorized access'));
    }
};
exports.userAccessPermission = userAccessPermission;
