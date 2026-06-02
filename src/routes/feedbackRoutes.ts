import { Request, Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import { userAccessPermission } from '../middlewares/userAccessPermission';
import { catchAsync } from '../utils/catchAsync';
import User from '../models/userSchema';
import UserFeedback from '../models/userFeedbackSchema';
import { ApiError } from '../utils/ApiError';
import { deleteAllFeedback, deleteFeedbackById, getAllFeedback, sentFeedback } from '../controllers/feedbackController';

type AuthRequest = Request & {
  userInfo?: import('../models/userSchema').UserDocument;
};

const router = Router();

router.get('/getAllFeedback', catchAsync(getAllFeedback));

router.post('/sentFeedback',catchAsync(sentFeedback));

router.delete('/deleteFeedbackById/:feedbackId',deleteFeedbackById);

router.delete('/deleteAllFeedback',deleteAllFeedback);

export default router;