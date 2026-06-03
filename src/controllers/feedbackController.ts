import { Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import UserFeedback from '../models/userFeedbackSchema';

export const getAllFeedback = async (req: Request, res: Response) => {
    const { page } = req.params;
    const parsedPage = parseInt(page as string) || 1;
    const limit = 10;
    const skip = (parsedPage - 1) * limit;
    const result = await UserFeedback.find().skip(skip).limit(limit);
    const total = await UserFeedback.countDocuments();
    res.status(200).json({ 
        status: 'success', 
        message: 'Get all feedback successfully.' ,
        data: result, 
        meta: {total, showing: result.length, page: parsedPage, limit }
    });
}


export const sentFeedback = async (req: Request, res: Response) => {
    const { feedbackText, rating } = req.body;

    if (!feedbackText || !rating) {
        throw new ApiError(400, 'All fields are required.');
    }

    const newFeedback = new UserFeedback({
        feedbackText,
        rating
    });

    await newFeedback.save();

    res.status(201).json({ status: 'success', message: 'Thank you for your feedback.' });
}


export const deleteFeedbackById = async (req: Request, res: Response) => {
    const { feedbackId } = req.params;
    if (!feedbackId) {
        throw new ApiError(400, 'feedbackId is required.');
    }
    const result = await UserFeedback.findByIdAndDelete(feedbackId);
    res.status(200).json({ status: 'success', data: result, message: 'Feedback deleted successfully.' });
}

export const deleteAllFeedback = async (req: Request, res: Response) => {
    const result = await UserFeedback.deleteMany();
    res.status(200).json({ status: 'success', data: result, message: 'All feedbacks deleted successfully.' });
}