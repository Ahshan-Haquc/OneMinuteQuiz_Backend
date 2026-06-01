import type { Document, Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      userInfo?: Document & {
        _id: string | Types.ObjectId;
        name?: string;
        email: string;
        role: 'user' | 'admin';
        tokens: Array<{ token: string }>;
        save: () => Promise<unknown>;
      };
      token?: string;
    }
  }
}

export {};
