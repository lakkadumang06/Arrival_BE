import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { sendError } from '../shared/utils/apiResponse';

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => ({
      field: (err as any).path,
      message: err.msg,
    }));
    sendError(res, 422, 'Validation failed', errorMessages);
    return;
  }
  next();
};
