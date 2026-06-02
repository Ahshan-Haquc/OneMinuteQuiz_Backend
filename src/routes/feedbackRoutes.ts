import { Request, Router } from 'express';
import { catchAsync } from '../utils/catchAsync';
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