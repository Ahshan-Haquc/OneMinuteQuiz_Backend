import { Document, model, Schema } from 'mongoose';

export interface HighestScore {
  first: number;
  second: number;
  third: number;
}

export interface QuizTrackingDocument extends Document {
  totalGuessTheWordGamePlayed: number;
  totalQuickCalculateGamePlayed: number;
  totalMemoryFlashGamePlayed: number;
  totalTargetClickerGamePlayed: number;
  totalGuessTheWordGameRating: number;
  totalQuickCalculateGameRating: number;
  totalMemoryFlashGameRating: number;
  totalTargetClickerGameRating: number;
  guessTheWordTopThreeScores: HighestScore;
  quickCalculateTopThreeScores: HighestScore;
  memoryFlashTopThreeScores: HighestScore;
  targetClickerTopThreeScores: HighestScore;
  averageRating: number;
}

const quizTrackingSchema = new Schema<QuizTrackingDocument>(
  {
    totalGuessTheWordGamePlayed: {
      type: Number,
      default: 0,
    },
    totalQuickCalculateGamePlayed: {
      type: Number,
      default: 0,
    },
    totalMemoryFlashGamePlayed: {
      type: Number,
      default: 0,
    },
    totalTargetClickerGamePlayed: {
      type: Number,
      default: 0,
    },
    totalGuessTheWordGameRating: {
      type: Number,
      default: 5,
    },
    totalQuickCalculateGameRating: {
      type: Number,
      default: 5,
    },
    totalMemoryFlashGameRating: {
      type: Number,
      default: 5,
    },
    totalTargetClickerGameRating: {
      type: Number,
      default: 5,
    },
    guessTheWordTopThreeScores: {
      first: { type: Number, default: 0 },
      second: { type: Number, default: 0 },
      third: { type: Number, default: 0 },
    },
    quickCalculateTopThreeScores: {
      first: { type: Number, default: 0 },
      second: { type: Number, default: 0 },
      third: { type: Number, default: 0 },
    },
    memoryFlashTopThreeScores: {
      first: { type: Number, default: 0 },
      second: { type: Number, default: 0 },
      third: { type: Number, default: 0 },
    },
    targetClickerTopThreeScores: {
      first: { type: Number, default: 0 },
      second: { type: Number, default: 0 },
      third: { type: Number, default: 0 },
    },
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const QuizTracking = model<QuizTrackingDocument>('QuizTracking', quizTrackingSchema);
export default QuizTracking;