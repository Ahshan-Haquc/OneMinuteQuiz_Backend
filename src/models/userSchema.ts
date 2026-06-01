import { Document, model, Schema } from 'mongoose';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { env } from '../config/validateEnv';

interface TokenObject {
  token: string;
}

export interface UserDocument extends Document {
  name?: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  tokens: TokenObject[];
  registrationDate: Date;
  generateToken(): string;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    registrationDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.generateToken = function (this: UserDocument): string {
  const signOptions: SignOptions = { expiresIn: env.JWT_EXPIRATION as jwt.SignOptions['expiresIn'] };
  const secretKey: Secret = env.JWT_SECRET;

  return jwt.sign(
    {
      _id: this._id.toString(),
      role: this.role,
      email: this.email,
    },
    secretKey,
    signOptions,
  );
};

export const User = model<UserDocument>('User', userSchema);
export default User;
