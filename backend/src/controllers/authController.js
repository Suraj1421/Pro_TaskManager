import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { signToken } from '../utils/token.js';

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatarUrl: user.avatarUrl || null,
  createdAt: user.createdAt,
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError('Email already in use', 409);
  }

  const user = await User.create({ name, email, password });
  const token = signToken(user);

  res.status(201).json({
    token,
    user: serializeUser(user),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError('Invalid credentials', 401);
  }

  const matches = await user.comparePassword(password);
  if (!matches) {
    throw new ApiError('Invalid credentials', 401);
  }

  const token = signToken(user);
  res.json({
    token,
    user: serializeUser(user),
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({
    user: serializeUser(req.user),
  });
});
