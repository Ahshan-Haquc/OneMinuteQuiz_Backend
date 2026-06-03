import { Request, Router } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { deleteAllFeedback, deleteFeedbackById, getAllFeedback, sentFeedback } from '../controllers/feedbackController';
import { userAccessPermission } from '../middlewares/userAccessPermission';

type AuthRequest = Request & {
  userInfo?: import('../models/userSchema').UserDocument;
};

const router = Router();

router.get('/getAllFeedback/:page', userAccessPermission, catchAsync(getAllFeedback));

router.post('/sentFeedback', catchAsync(sentFeedback));

router.delete('/deleteFeedbackById/:feedbackId', userAccessPermission, catchAsync(deleteFeedbackById));

router.delete('/deleteAllFeedback', userAccessPermission, catchAsync(deleteAllFeedback));

export default router;