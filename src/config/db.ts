import mongoose from 'mongoose';

export const connectDB = async (mongoUri: string): Promise<void> => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongoUri);
    console.log('1MinuteQuiz Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};
