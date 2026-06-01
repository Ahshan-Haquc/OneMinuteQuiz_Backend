import express, { json, urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import allRoutes from './routes/allRoutes';
import { notFoundHandler } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';
import { validateEnv } from './config/validateEnv';

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
      'https://1-minute-quiz.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use('/', allRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
