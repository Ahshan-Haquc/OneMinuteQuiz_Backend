import { NextFunction, Request, Response } from 'express';

export const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => {
  return (req: Request, res: Response, next: NextFunction): Promise<void> =>
    fn(req, res, next).catch(next);
};
