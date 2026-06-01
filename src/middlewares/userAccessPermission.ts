import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/userSchema';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/validateEnv';

interface TokenPayload extends JwtPayload {
  _id: string;
}

type AuthRequest = Request & {
  token?: string;
  userInfo?: import('../models/userSchema').UserDocument;
};

export const userAccessPermission = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const cookieToken = req.cookies?.userCookie;
    if (!cookieToken || typeof cookieToken !== 'string') {
      throw new ApiError(401, 'Unauthorized access');
    }

    const payload = jwt.verify(cookieToken, env.JWT_SECRET) as TokenPayload;
    if (!payload?._id) {
      throw new ApiError(401, 'Unauthorized access');
    }

    const user = await User.findById(payload._id);
    if (!user) {
      throw new ApiError(401, 'Unauthorized access');
    }

    const authReq = req as AuthRequest;
    authReq.token = cookieToken;
    authReq.userInfo = user;
    next();
  } catch (error) {
    next(new ApiError(401, 'Unauthorized access'));
  }
};
