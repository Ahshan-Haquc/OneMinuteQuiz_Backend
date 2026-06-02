import { Router } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { deleteUser, loadAdminDashboardValues } from '../controllers/adminController';

const router = Router();

router.get(
  '/loadAdminDashboardValues',
  catchAsync(loadAdminDashboardValues)
);

router.post(
  '/deleteUser',
  catchAsync(deleteUser),
);

export default router;
