import Project from '../models/Project.js';
import { ApiError } from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const loadProject = asyncHandler(async (req, res, next) => {
  const projectId = req.params.projectId || req.params.id;
  const project = await Project.findById(projectId).populate(
    'members.user',
    'name email'
  );

  if (!project) {
    throw new ApiError('Project not found', 404);
  }

  req.project = project;
  next();
});

export const requireProjectMember = (req, res, next) => {
  const userId = req.user._id.toString();
  const membership = req.project.members.find((member) => {
    const memberId = member.user._id ? member.user._id.toString() : member.user.toString();
    return memberId === userId;
  });

  if (!membership) {
    return next(new ApiError('Not a project member', 403));
  }

  req.projectRole = membership.role;
  return next();
};

export const requireProjectRole = (...roles) => (req, res, next) => {
  if (!req.projectRole || !roles.includes(req.projectRole)) {
    return next(new ApiError('Insufficient project role', 403));
  }
  return next();
};
