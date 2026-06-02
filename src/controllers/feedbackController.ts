import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../utils/ApiError';
import UserFeedback from '../models/userFeedbackSchema';
import { Types } from 'mongoose';

export const getAllFeedback = catchAsync(async (req: Request, res: Response) => {
    const result = await UserFeedback.find();
    res.status(200).json({ status: 'success', data: result, message: 'Get all feedback successfully.' });
})


export const sentFeedback = async (req: Request, res: Response) => {
    const { userId, userName, feedbackText, rating } = req.body;

    if (!userId || !userName || !feedbackText || !rating) {
        throw new ApiError(400, 'All fields are required.');
    }

    if (!Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, 'Invalid userId format.');
    }

    const newFeedback = new UserFeedback({
        userId: new Types.ObjectId(userId),
        userName,
        feedbackText,
        rating,
    });

    await newFeedback.save();

    res.status(201).json({ status: 'success', message: 'Thank you for your feedback.' });
}


export const deleteFeedbackById = catchAsync(async (req, res) => {
    const { feedbackId } = req.params;
    if (!feedbackId) {
        throw new ApiError(400, 'feedbackId is required.');
    }
    const result = await UserFeedback.findByIdAndDelete(feedbackId);
    res.status(200).json({ status: 'success', data: result, message: 'Delete feedback successfully.' });
})

export const deleteAllFeedback = catchAsync(async (req, res) => {
    const result = await UserFeedback.deleteMany();
    res.status(200).json({ status: 'success', data: result, message: 'Delete feedback successfully.' });
})