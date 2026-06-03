"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllFeedback = exports.deleteFeedbackById = exports.sentFeedback = exports.getAllFeedback = void 0;
const ApiError_1 = require("../utils/ApiError");
const userFeedbackSchema_1 = __importDefault(require("../models/userFeedbackSchema"));
const getAllFeedback = async (req, res) => {
    const { page } = req.params;
    const parsedPage = parseInt(page) || 1;
    const limit = 10;
    const skip = (parsedPage - 1) * limit;
    const result = await userFeedbackSchema_1.default.find().skip(skip).limit(limit);
    const total = await userFeedbackSchema_1.default.countDocuments();
    res.status(200).json({
        status: 'success',
        message: 'Get all feedback successfully.',
        data: result,
        meta: { total, showing: result.length, page: parsedPage, limit }
    });
};
exports.getAllFeedback = getAllFeedback;
const sentFeedback = async (req, res) => {
    const { feedbackText, rating } = req.body;
    if (!feedbackText || !rating) {
        throw new ApiError_1.ApiError(400, 'All fields are required.');
    }
    const newFeedback = new userFeedbackSchema_1.default({
        feedbackText,
        rating
    });
    await newFeedback.save();
    res.status(201).json({ status: 'success', message: 'Thank you for your feedback.' });
};
exports.sentFeedback = sentFeedback;
const deleteFeedbackById = async (req, res) => {
    const { feedbackId } = req.params;
    if (!feedbackId) {
        throw new ApiError_1.ApiError(400, 'feedbackId is required.');
    }
    const result = await userFeedbackSchema_1.default.findByIdAndDelete(feedbackId);
    res.status(200).json({ status: 'success', data: result, message: 'Feedback deleted successfully.' });
};
exports.deleteFeedbackById = deleteFeedbackById;
const deleteAllFeedback = async (req, res) => {
    const result = await userFeedbackSchema_1.default.deleteMany();
    res.status(200).json({ status: 'success', data: result, message: 'All feedbacks deleted successfully.' });
};
exports.deleteAllFeedback = deleteAllFeedback;
