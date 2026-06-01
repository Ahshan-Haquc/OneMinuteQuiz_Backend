import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (res.headersSent) {
    next(err as Error);
    return;
  }

  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err instanceof Error ? err.message : 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    message,
  });
};
