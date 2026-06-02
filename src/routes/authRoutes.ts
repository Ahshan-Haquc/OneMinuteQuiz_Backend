import { Request, Response, Router } from 'express';
import { Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  login,
  signup,
  signupDefault,
  logout,
  checkMe
} from '../controllers/authController';
import { userAccessPermission } from '../middlewares/userAccessPermission';
import { catchAsync } from '../utils/catchAsync';
import User from '../models/userSchema';
import UserFeedback from '../models/userFeedbackSchema';
import { ApiError } from '../utils/ApiError';

const router = Router();

router.post('/login', catchAsync(login));
router.get('/signup', signupDefault);
router.post('/signup', catchAsync(signup));
router.get('/logout', userAccessPermission, catchAsync(logout));
router.get('/me', userAccessPermission, catchAsync(checkMe));

export default router;