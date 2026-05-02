import { ApiError } from '../utils/apiError.js';

export const notFound = (req, res, next) =>
  next(new ApiError(`Route not found - ${req.originalUrl}`, 404));

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const payload = {
    message: err.message || 'Server error',
  };

  if (err.details) {
    payload.details = err.details;
  }

  if (process.env.NODE_ENV === 'development' && err.stack) {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};
