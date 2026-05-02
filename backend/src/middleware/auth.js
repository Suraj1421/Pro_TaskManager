import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
};

export const protect = asyncHandler(async (req, res, next) => {
  const token = getTokenFromHeader(req);
  if (!token) {
    throw new ApiError('Not authorized, token missing', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new ApiError('User not found', 401);
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError('Not authorized, token invalid', 401);
  }
});

export const requireUserRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError('Insufficient permissions', 403));
  }
  return next();
};
