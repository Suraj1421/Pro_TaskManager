import Project from '../models/Project.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const serializeProject = (project) => ({
  id: project._id,
  name: project.name,
  description: project.description,
  status: project.status,
  owner: project.owner,
  members: project.members.map((member) => ({
    user: member.user,
    role: member.role,
    joinedAt: member.joinedAt,
  })),
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
});

export const listProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ 'members.user': req.user._id })
    .populate('members.user', 'name email')
    .sort({ updatedAt: -1 });

  res.json({ projects: projects.map(serializeProject) });
});

export const createProject = asyncHandler(async (req, res) => {
  const { name, description, status } = req.body;

  const project = await Project.create({
    name,
    description,
    status,
    owner: req.user._id,
    members: [{ user: req.user._id, role: 'owner' }],
  });

  const populated = await Project.findById(project._id).populate(
    'members.user',
    'name email'
  );

  res.status(201).json({ project: serializeProject(populated) });
});

export const getProject = asyncHandler(async (req, res) => {
  res.json({ project: serializeProject(req.project) });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = req.project;

  if (req.body.name !== undefined) project.name = req.body.name;
  if (req.body.description !== undefined) project.description = req.body.description;
  if (req.body.status !== undefined) project.status = req.body.status;

  await project.save();
  res.json({ project: serializeProject(project) });
});

export const deleteProject = asyncHandler(async (req, res) => {
  await Task.deleteMany({ project: req.project._id });
  await req.project.deleteOne();
  res.status(204).send();
});

export const addMember = asyncHandler(async (req, res) => {
  const { userId, role } = req.body;
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new ApiError('User not found', 404);
  }

  const existing = req.project.members.find((member) => {
    const memberId = member.user._id ? member.user._id.toString() : member.user.toString();
    return memberId === userId;
  });

  if (existing) {
    throw new ApiError('User already a member', 409);
  }

  req.project.members.push({ user: userId, role: role || 'member' });
  await req.project.save();
  await req.project.populate('members.user', 'name email');

  res.status(201).json({ project: serializeProject(req.project) });
});

export const updateMember = asyncHandler(async (req, res) => {
  const { memberId } = req.params;
  const { role } = req.body;

  const member = req.project.members.find((entry) => {
    const entryId = entry.user._id ? entry.user._id.toString() : entry.user.toString();
    return entryId === memberId;
  });

  if (!member) {
    throw new ApiError('Member not found', 404);
  }

  if (member.role === 'owner') {
    throw new ApiError('Owner role cannot be changed', 400);
  }

  member.role = role;
  await req.project.save();
  await req.project.populate('members.user', 'name email');

  res.json({ project: serializeProject(req.project) });
});

export const removeMember = asyncHandler(async (req, res) => {
  const { memberId } = req.params;
  const member = req.project.members.find((entry) => {
    const entryId = entry.user._id ? entry.user._id.toString() : entry.user.toString();
    return entryId === memberId;
  });

  if (!member) {
    throw new ApiError('Member not found', 404);
  }

  if (member.role === 'owner') {
    throw new ApiError('Owner cannot be removed', 400);
  }

  req.project.members = req.project.members.filter((entry) => {
    const entryId = entry.user._id ? entry.user._id.toString() : entry.user.toString();
    return entryId !== memberId;
  });

  await req.project.save();
  await req.project.populate('members.user', 'name email');

  res.json({ project: serializeProject(req.project) });
});
