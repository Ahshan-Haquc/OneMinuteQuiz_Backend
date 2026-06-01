import { Document, model, Schema, Types } from 'mongoose';

export interface UserFeedbackDocument extends Document {
  userId: Types.ObjectId;
  userName: string;
  feedbackText: string;
  rating: number;
  date: Date;
}

const userFeedbackSchema = new Schema<UserFeedbackDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    feedbackText: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export const UserFeedback = model<UserFeedbackDocument>('UserFeedback', userFeedbackSchema);
export default UserFeedback;
