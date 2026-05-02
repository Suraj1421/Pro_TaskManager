import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatarUrl: user.avatarUrl || null,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ users: users.map(serializeUser) });
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    throw new ApiError('User not found', 404);
  }
  res.json({ user: serializeUser(user) });
});

export const updateUser = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
    throw new ApiError('Not authorized to update this user', 403);
  }

  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    throw new ApiError('User not found', 404);
  }

  if (req.body.name !== undefined) user.name = req.body.name;
  if (req.body.avatarUrl !== undefined) user.avatarUrl = req.body.avatarUrl;

  await user.save();
  res.json({ user: serializeUser(user) });
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
    throw new ApiError('Not authorized to delete this user', 403);
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError('User not found', 404);
  }

  await user.deleteOne();
  res.status(204).send();
});
