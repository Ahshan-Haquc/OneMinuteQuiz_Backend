import { Router } from 'express';
import {
  login,
  signup,
  signupDefault,
  logout,
  checkMe
} from '../controllers/authController';
import { userAccessPermission } from '../middlewares/userAccessPermission';
import { catchAsync } from '../utils/catchAsync';

const router = Router();

router.post('/login', catchAsync(login));
router.get('/signup', signupDefault);
router.post('/signup', catchAsync(signup));
router.get('/logout', userAccessPermission, catchAsync(logout));
router.get('/me', userAccessPermission, catchAsync(checkMe));

export default router;