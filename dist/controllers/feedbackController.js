"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllFeedback = exports.deleteFeedbackById = exports.sentFeedback = exports.getAllFeedback = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const ApiError_1 = require("../utils/ApiError");
const userFeedbackSchema_1 = __importDefault(require("../models/userFeedbackSchema"));
const mongoose_1 = require("mongoose");
exports.getAllFeedback = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await userFeedbackSchema_1.default.find();
    res.status(200).json({ status: 'success', data: result, message: 'Get all feedback successfully.' });
});
const sentFeedback = async (req, res) => {
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
    res.status(201).json({ status: 'success', message: 'Thank you for your feedback.' });
};
exports.sentFeedback = sentFeedback;
exports.deleteFeedbackById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { feedbackId } = req.params;
    if (!feedbackId) {
        throw new ApiError_1.ApiError(400, 'feedbackId is required.');
    }
    const result = await userFeedbackSchema_1.default.findByIdAndDelete(feedbackId);
    res.status(200).json({ status: 'success', data: result, message: 'Delete feedback successfully.' });
});
exports.deleteAllFeedback = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await userFeedbackSchema_1.default.deleteMany();
    res.status(200).json({ status: 'success', data: result, message: 'Delete feedback successfully.' });
});
