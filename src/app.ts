import express, { json, urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { notFoundHandler } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';
import { validateEnv } from './config/validateEnv';
import authRoutes from './routes/authRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import adminRoutes from './routes/adminRoutes';
import quizRoutes from './routes/quizRoutes';

validateEnv();

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.set('trust proxy', 1);

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://one-minute-quiz-frontend.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/quiz', quizRoutes);
app.use('/api/v1/feedback', feedbackRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
