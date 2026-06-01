import { Request, Response, Router } from 'express';
import { Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  login,
  signup,
  signupDefault,
} from '../controllers/userController';
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

router.post('/login', catchAsync(login));
router.get('/signup', signupDefault);
router.post('/signup', catchAsync(signup));

router.get(
  '/logout',
  userAccessPermission,
  catchAsync(async (req, res: Response) => {
    const authReq = req as AuthRequest;
    if (!authReq.userInfo) {
      throw new ApiError(401, 'Unauthorized access');
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
  }),
);

router.get('/me', userAccessPermission, (req, res: Response) => {
  const authReq = req as AuthRequest;
  res.status(200).json({ status: 'success', data: { userInfo: authReq.userInfo, message: 'User information retrieved successfully.' } });
});

router.get('/feedback', (req, res) => {
  res.status(200).json({ status: 'success', data: { message: 'Welcome to feedback page.' } });
});

router.post(
  '/feedback',
  catchAsync(async (req, res) => {
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

    res.status(201).json({ status: 'success', data: { message: 'Feedback submitted successfully.' } });
  }),
);

router.post(
  '/register-admin',
  catchAsync(async (req, res) => {
    const { username, email, password, secret } = req.body;

    if (!username || !email || !password || !secret) {
      throw new ApiError(400, 'All fields are required.');
    }

    if (secret !== process.env.ADMIN_CREATION_SECRET) {
      throw new ApiError(403, 'Unauthorized');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUser = new User({
      name: username,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    await adminUser.save();

    res.status(201).json({ status: 'success', data: { message: 'Admin created' } });
  }),
);

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
