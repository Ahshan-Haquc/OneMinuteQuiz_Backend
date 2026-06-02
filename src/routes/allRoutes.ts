import { Request, Response, Router } from 'express';
import { Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import { userAccessPermission } from '../middlewares/userAccessPermission';
import { catchAsync } from '../utils/catchAsync';
import User from '../models/userSchema';
import UserFeedback from '../models/userFeedbackSchema';
import { ApiError } from '../utils/ApiError';

type AuthRequest = Request & {
  userInfo?: import('../models/userSchema').UserDocument;
};

const router = Router();

router.get('/', userAccessPermission, (req, res) => {
  res.status(200).json({ status: 'success', data: { message: 'Welcome to home page.' } });
});

router.get(
  '/loadAdminDashboardValues',
  catchAsync(async (req, res) => {
    const ratingCount: Record<1 | 2 | 3 | 4 | 5, number> = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    const users = await User.find({ role: 'user' });
    const userFeedbacks = await UserFeedback.find();

    const userCount = users.length;
    const feedbackCount = userFeedbacks.length;

    userFeedbacks.forEach((feedback) => {
      const feedbackRating = feedback.rating as 1 | 2 | 3 | 4 | 5;
      if (feedbackRating >= 1 && feedbackRating <= 5) {
        ratingCount[feedbackRating] += 1;
      }
    });

    const totalRatings =
      ratingCount[5] * 5 +
      ratingCount[4] * 4 +
      ratingCount[3] * 3 +
      ratingCount[2] * 2 +
      ratingCount[1] * 1;

    const totalFeedbacks =
      ratingCount[5] +
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
  }),
);

router.post(
  '/deleteUser',
  catchAsync(async (req, res) => {
    const { userId } = req.body;
    if (!userId || !Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, 'Invalid userId');
    }

    await User.deleteOne({ _id: new Types.ObjectId(userId) });
    const newUsers = await User.find();

    res.status(200).json({ status: 'success', data: { newUsers } });
  }),
);

router.post(
  '/deleteFeedback',
  catchAsync(async (req, res) => {
    const { userFeedbackId } = req.body;
    if (!userFeedbackId || !Types.ObjectId.isValid(userFeedbackId)) {
      throw new ApiError(400, 'Invalid userFeedbackId');
    }

    await UserFeedback.deleteOne({ _id: new Types.ObjectId(userFeedbackId) });
    const newFeedback = await UserFeedback.find();

    res.status(200).json({ status: 'success', data: { newFeedback } });
  }),
);

export default router;
