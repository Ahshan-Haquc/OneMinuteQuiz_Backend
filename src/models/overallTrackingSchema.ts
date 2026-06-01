import { Document, model, Schema } from 'mongoose';

export interface OverallTrackingDocument extends Document {
  totalQuessTheWordGamePlayed: number;
  totalQuickCalculateGamePlayed: number;
  averageRating: number;
}

const overallTrackingSchema = new Schema<OverallTrackingDocument>(
  {
    totalQuessTheWordGamePlayed: {
      type: Number,
      default: 0,
    },
    totalQuickCalculateGamePlayed: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true },
);

export const OverallTracking = model<OverallTrackingDocument>('OverallTracking', overallTrackingSchema);
export default OverallTracking;
