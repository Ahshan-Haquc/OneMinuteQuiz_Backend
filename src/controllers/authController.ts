import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/userSchema';
import { ApiError } from '../utils/ApiError';

type AuthRequest = Request & {
  userInfo?: import('../models/userSchema').UserDocument;
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required.');
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const token = user.generateToken();
    user.tokens.push({ token });
    await user.save();

    res.cookie('userCookie', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60,
    });

    res.status(200).json({
      status: 'success',
      data: {
        message: 'Login successful',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          accessToken: token,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signupDefault = (req: Request, res: Response): void => {
  res.status(200).json({
    status: 'success',
    data: { message: 'Welcome to register page.' },
  });
};

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, 'All fields are required.');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, 'Email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();

    res.status(201).json({
      status: 'success',
      data: { message: 'User registered successfully.' },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
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
  } catch (error) {
    next(error);
  }
}

export const checkMe = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  res.status(200).json({ status: 'success', data: { userInfo: authReq.userInfo, message: 'User information retrieved successfully.' } });
}

export const registerAdmin = async (req: Request, res: Response) => {
  const { name, email, password, secret } = req.body;

  if (!name || !email || !password || !secret) {
    throw new ApiError(400, 'All fields are required.');
  }

  if (secret !== process.env.ADMIN_CREATION_SECRET) {
    throw new ApiError(403, 'Unauthorized');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const adminUser = new User({
    name,
    email,
    password: hashedPassword,
    role: 'admin',
  });

  await adminUser.save();

  res.status(201).json({ status: 'success', data: { message: 'Admin created' } });
}