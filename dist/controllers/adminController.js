"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.loadAdminDashboardValues = void 0;
const mongoose_1 = require("mongoose");
const userSchema_1 = __importDefault(require("../models/userSchema"));
const userFeedbackSchema_1 = __importDefault(require("../models/userFeedbackSchema"));
const ApiError_1 = require("../utils/ApiError");
const loadAdminDashboardValues = async (req, res) => {
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
};
exports.loadAdminDashboardValues = loadAdminDashboardValues;
const deleteUser = async (req, res) => {
    const { userId } = req.body;
    if (!userId || !mongoose_1.Types.ObjectId.isValid(userId)) {
        throw new ApiError_1.ApiError(400, 'Invalid userId');
    }
    await userSchema_1.default.deleteOne({ _id: new mongoose_1.Types.ObjectId(userId) });
    const newUsers = await userSchema_1.default.find();
    res.status(200).json({ status: 'success', data: { newUsers } });
};
exports.deleteUser = deleteUser;
