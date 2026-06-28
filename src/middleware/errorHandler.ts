import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';
import { AppError } from '../shared/utils/AppError';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Multer upload errors (e.g. file too large) → 400 instead of generic 500
  if (err instanceof MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'Image exceeds the 5MB size limit'
        : `Upload error: ${err.message}`;
    res.status(400).json({ success: false, message });
    return;
  }

  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};
