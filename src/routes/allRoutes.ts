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

export default router;
