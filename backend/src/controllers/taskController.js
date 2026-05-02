import Task from '../models/Task.js';
import { ApiError } from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const serializeTask = (task) => ({
  id: task._id,
  project: task.project,
  title: task.title,
  description: task.description,
  status: task.status,
  priority: task.priority,
  dueDate: task.dueDate,
  order: task.order,
  createdBy: task.createdBy,
  assignees: task.assignees,
  tags: task.tags,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});

const ensureAssigneesAreMembers = (project, assignees = []) => {
  if (!assignees.length) return;
  const memberIds = new Set(
    project.members.map((member) =>
      (member.user._id ? member.user._id.toString() : member.user.toString())
    )
  );
  const invalid = assignees.find((assignee) => !memberIds.has(assignee.toString()));
  if (invalid) {
    throw new ApiError('Assignee must be a project member', 400);
  }
};

const canMutateTask = (req, task) => {
  if (['owner', 'admin'].includes(req.projectRole)) {
    return true;
  }
  const assigneeIds = task.assignees.map((assignee) => assignee.toString());
  return assigneeIds.includes(req.user._id.toString());
};

export const listTasks = asyncHandler(async (req, res) => {
  const filters = { project: req.project._id };
  if (req.query.status) {
    filters.status = req.query.status;
  }
  if (req.query.assignee) {
    filters.assignees = req.query.assignee;
  }
  if (req.query.search) {
    filters.title = { $regex: req.query.search, $options: 'i' };
  }

  const tasks = await Task.find(filters)
    .sort({ order: 1, createdAt: -1 })
    .populate('assignees', 'name email')
    .populate('createdBy', 'name email');

  res.json({ tasks: tasks.map(serializeTask) });
});

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate, order, assignees, tags } = req.body;

  if (!['owner', 'admin'].includes(req.projectRole)) {
    throw new ApiError('Insufficient project role', 403);
  }

  ensureAssigneesAreMembers(req.project, assignees);

  const task = await Task.create({
    project: req.project._id,
    title,
    description,
    status,
    priority,
    dueDate: dueDate ? new Date(dueDate) : undefined,
    order,
    assignees,
    tags,
    createdBy: req.user._id,
  });

  await task.populate('assignees', 'name email');
  await task.populate('createdBy', 'name email');

  res.status(201).json({ task: serializeTask(task) });
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.taskId,
    project: req.project._id,
  })
    .populate('assignees', 'name email')
    .populate('createdBy', 'name email');

  if (!task) {
    throw new ApiError('Task not found', 404);
  }

  res.json({ task: serializeTask(task) });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.taskId,
    project: req.project._id,
  });

  if (!task) {
    throw new ApiError('Task not found', 404);
  }

  if (!canMutateTask(req, task)) {
    throw new ApiError('Not authorized to update this task', 403);
  }

  if (req.body.title !== undefined) task.title = req.body.title;
  if (req.body.description !== undefined) task.description = req.body.description;
  if (req.body.status !== undefined) task.status = req.body.status;
  if (req.body.priority !== undefined) task.priority = req.body.priority;
  if (req.body.dueDate !== undefined) {
    task.dueDate = req.body.dueDate ? new Date(req.body.dueDate) : null;
  }
  if (req.body.order !== undefined) task.order = req.body.order;
  if (req.body.tags !== undefined) task.tags = req.body.tags;

  if (req.body.assignees !== undefined) {
    ensureAssigneesAreMembers(req.project, req.body.assignees);
    task.assignees = req.body.assignees;
  }

  await task.save();
  await task.populate('assignees', 'name email');
  await task.populate('createdBy', 'name email');

  res.json({ task: serializeTask(task) });
});

export const deleteTask = asyncHandler(async (req, res) => {
  if (!['owner', 'admin'].includes(req.projectRole)) {
    throw new ApiError('Not authorized to delete this task', 403);
  }

  const task = await Task.findOne({
    _id: req.params.taskId,
    project: req.project._id,
  });

  if (!task) {
    throw new ApiError('Task not found', 404);
  }

  await task.deleteOne();
  res.status(204).send();
});
