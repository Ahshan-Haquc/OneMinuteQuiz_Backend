"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userController_1 = require("../controllers/userController");
const userAccessPermission_1 = require("../middlewares/userAccessPermission");
const catchAsync_1 = require("../utils/catchAsync");
const userSchema_1 = __importDefault(require("../models/userSchema"));
const userFeedbackSchema_1 = __importDefault(require("../models/userFeedbackSchema"));
const ApiError_1 = require("../utils/ApiError");
const router = (0, express_1.Router)();
router.get('/', userAccessPermission_1.userAccessPermission, (req, res) => {
    res.status(200).json({ status: 'success', data: { message: 'Welcome to home page.' } });
});
router.post('/login', (0, catchAsync_1.catchAsync)(userController_1.login));
router.get('/signup', userController_1.signupDefault);
router.post('/signup', (0, catchAsync_1.catchAsync)(userController_1.signup));
router.get('/logout', userAccessPermission_1.userAccessPermission, (0, catchAsync_1.catchAsync)(async (req, res) => {
    const authReq = req;
    if (!authReq.userInfo) {
        throw new ApiError_1.ApiError(401, 'Unauthorized access');
    }
    authReq.userInfo.tokens = [];
    await authReq.userInfo.save();
    res.cookie('userCookie', '', {
        expires: new Date(0),
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    });
    res.status(200).json({ status: 'success', data: { message: 'Logout successful.' } });
}));
router.get('/me', userAccessPermission_1.userAccessPermission, (req, res) => {
    const authReq = req;
    res.status(200).json({ status: 'success', data: { userInfo: authReq.userInfo, message: 'User information retrieved successfully.' } });
});
router.get('/feedback', (req, res) => {
    res.status(200).json({ status: 'success', data: { message: 'Welcome to feedback page.' } });
});
router.post('/feedback', (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userId, userName, feedbackText, rating } = req.body;
    if (!userId || !userName || !feedbackText || !rating) {
        throw new ApiError_1.ApiError(400, 'All fields are required.');
    }
    if (!mongoose_1.Types.ObjectId.isValid(userId)) {
        throw new ApiError_1.ApiError(400, 'Invalid userId format.');
    }
    const newFeedback = new userFeedbackSchema_1.default({
        userId: new mongoose_1.Types.ObjectId(userId),
        userName,
        feedbackText,
        rating,
    });
    await newFeedback.save();
    res.status(201).json({ status: 'success', data: { message: 'Feedback submitted successfully.' } });
}));
router.post('/register-admin', (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { username, email, password, secret } = req.body;
    if (!username || !email || !password || !secret) {
        throw new ApiError_1.ApiError(400, 'All fields are required.');
    }
    if (secret !== process.env.ADMIN_CREATION_SECRET) {
        throw new ApiError_1.ApiError(403, 'Unauthorized');
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const adminUser = new userSchema_1.default({
        name: username,
        email,
        password: hashedPassword,
        role: 'admin',
    });
    await adminUser.save();
    res.status(201).json({ status: 'success', data: { message: 'Admin created' } });
}));
router.get('/loadAdminDashboardValues', (0, catchAsync_1.catchAsync)(async (req, res) => {
    const ratingCount = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
    };
    const users = await userSchema_1.default.find({ role: 'user' });
    const userFeedbacks = await userFeedbackSchema_1.default.find();
    const userCount = users.length;
    const feedbackCount = userFeedbacks.length;
    userFeedbacks.forEach((feedback) => {
        const feedbackRating = feedback.rating;
        if (feedbackRating >= 1 && feedbackRating <= 5) {
            ratingCount[feedbackRating] += 1;
        }
    });
    const totalRatings = ratingCount[5] * 5 +
        ratingCount[4] * 4 +
        ratingCount[3] * 3 +
        ratingCount[2] * 2 +
        ratingCount[1] * 1;
    const totalFeedbacks = ratingCount[5] +
        ratingCount[4] +
        ratingCount[3] +
        ratingCount[2] +
        ratingCount[1];
    const averageRating = totalFeedbacks === 0 ? 0 : Number((totalRatings / totalFeedbacks).toFixed(2));
    res.status(200).json({
        status: 'success',
        data: {
            users,
            userFeedbacks,
            userCount,
            feedbackCount,
            ratingCount,
            averageRating,
        },
    });
}));
router.post('/deleteUser', (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userId } = req.body;
    if (!userId || !mongoose_1.Types.ObjectId.isValid(userId)) {
        throw new ApiError_1.ApiError(400, 'Invalid userId');
    }
    await userSchema_1.default.deleteOne({ _id: new mongoose_1.Types.ObjectId(userId) });
    const newUsers = await userSchema_1.default.find();
    res.status(200).json({ status: 'success', data: { newUsers } });
}));
router.post('/deleteFeedback', (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userFeedbackId } = req.body;
    if (!userFeedbackId || !mongoose_1.Types.ObjectId.isValid(userFeedbackId)) {
        throw new ApiError_1.ApiError(400, 'Invalid userFeedbackId');
    }
    await userFeedbackSchema_1.default.deleteOne({ _id: new mongoose_1.Types.ObjectId(userFeedbackId) });
    const newFeedback = await userFeedbackSchema_1.default.find();
    res.status(200).json({ status: 'success', data: { newFeedback } });
}));
exports.default = router;
