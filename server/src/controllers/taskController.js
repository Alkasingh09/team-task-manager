import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const userFields = 'name email role';

const visibleProjectIdsFor = async (user) => {
  if (user.role === 'admin') {
    return null;
  }

  const projects = await Project.find({
    $or: [{ owner: user._id }, { members: user._id }]
  }).select('_id');

  return projects.map((project) => project._id);
};

const assertAssigneeInProject = (project, assignedUserId) => {
  const allowed = project.members.some((memberId) => memberId.equals(assignedUserId));

  if (!allowed) {
    const error = new Error('Assigned user must be a project member');
    error.statusCode = 400;
    throw error;
  }
};

export const getTasks = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
  const filter = {};

  if (req.query.status) filter.status = req.query.status;
  if (req.query.priority) filter.priority = req.query.priority;
  if (req.query.project) filter.project = req.query.project;

  if (req.user.role === 'member') {
    const projectIds = await visibleProjectIdsFor(req.user);
    filter.$or = [{ assignedUser: req.user._id }, { project: { $in: projectIds } }];
  }

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .populate('project', 'title description')
      .populate('assignedUser', userFields)
      .populate('createdBy', userFields)
      .sort({ dueDate: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Task.countDocuments(filter)
  ]);

  res.json({
    data: tasks,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, status, dueDate, project, assignedUser } = req.body;
  const existingProject = await Project.findById(project);

  if (!existingProject) {
    res.status(404);
    throw new Error('Project not found');
  }

  assertAssigneeInProject(existingProject, assignedUser);

  const task = await Task.create({
    title,
    description,
    priority,
    status,
    dueDate,
    project,
    assignedUser,
    createdBy: req.user._id
  });

  await task.populate([
    { path: 'project', select: 'title description' },
    { path: 'assignedUser', select: userFields },
    { path: 'createdBy', select: userFields }
  ]);

  res.status(201).json(task);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (req.user.role === 'member') {
    if (!task.assignedUser.equals(req.user._id)) {
      res.status(403);
      throw new Error('Members can update only their own assigned tasks');
    }

    const allowedFields = ['status'];
    const invalidField = Object.keys(req.body).find((key) => !allowedFields.includes(key));

    if (invalidField) {
      res.status(403);
      throw new Error('Members can update task status only');
    }
  }

  const mutableFields = ['title', 'description', 'priority', 'status', 'dueDate', 'assignedUser', 'markedOverdue'];

  for (const field of mutableFields) {
    if (req.body[field] !== undefined) {
      task[field] = req.body[field];
    }
  }

  if (req.body.assignedUser) {
    const project = await Project.findById(task.project);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    assertAssigneeInProject(project, req.body.assignedUser);
  }

  await task.save();
  await task.populate([
    { path: 'project', select: 'title description' },
    { path: 'assignedUser', select: userFields },
    { path: 'createdBy', select: userFields }
  ]);

  res.json(task);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  await task.deleteOne();
  res.json({ message: 'Task deleted' });
});
