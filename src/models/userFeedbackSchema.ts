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
    }
  },
  {
    timestamps: true,
  }
);

export const UserFeedback = model<UserFeedbackDocument>('UserFeedback', userFeedbackSchema);
export default UserFeedback;
