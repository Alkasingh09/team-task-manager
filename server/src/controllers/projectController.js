import mongoose from 'mongoose';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const memberFields = 'name email role';

const canViewProject = (project, user) => {
  const isOwner = project.owner._id
    ? project.owner._id.equals(user._id)
    : project.owner.equals(user._id);
  const isMember = project.members.some((member) => {
    const id = member._id || member;
    return id.equals(user._id);
  });

  return user.role === 'admin' || isOwner || isMember;
};

export const getProjects = asyncHandler(async (req, res) => {
  const query =
    req.user.role === 'admin'
      ? {}
      : {
          $or: [{ owner: req.user._id }, { members: req.user._id }]
        };

  const projects = await Project.find(query)
    .populate('owner', memberFields)
    .populate('members', memberFields)
    .sort({ updatedAt: -1 });

  res.json(projects);
});

export const createProject = asyncHandler(async (req, res) => {
  const { title, description, members = [] } = req.body;
  const uniqueMembers = [...new Set([req.user._id.toString(), ...members])];
  const users = await User.find({ _id: { $in: uniqueMembers } });

  if (users.length !== uniqueMembers.length) {
    res.status(400);
    throw new Error('One or more members were not found');
  }

  const project = await Project.create({
    title,
    description,
    owner: req.user._id,
    members: uniqueMembers
  });

  const populated = await project.populate([
    { path: 'owner', select: memberFields },
    { path: 'members', select: memberFields }
  ]);

  res.status(201).json(populated);
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('owner', memberFields)
    .populate('members', memberFields);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (!canViewProject(project, req.user)) {
    res.status(403);
    throw new Error('You do not have access to this project');
  }

  const tasks = await Task.find({ project: project._id })
    .populate('assignedUser', memberFields)
    .populate('createdBy', memberFields)
    .sort({ dueDate: 1 });

  res.json({ project, tasks });
});

export const updateProject = asyncHandler(async (req, res) => {
  const { title, description, members } = req.body;
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (title !== undefined) project.title = title;
  if (description !== undefined) project.description = description;
  if (members !== undefined) {
    const uniqueMembers = [...new Set([project.owner.toString(), ...members])];
    const validIds = uniqueMembers.every((id) => mongoose.Types.ObjectId.isValid(id));

    if (!validIds) {
      res.status(400);
      throw new Error('Invalid member id supplied');
    }

    const users = await User.find({ _id: { $in: uniqueMembers } });
    if (users.length !== uniqueMembers.length) {
      res.status(400);
      throw new Error('One or more members were not found');
    }

    project.members = uniqueMembers;
  }

  await project.save();
  await project.populate([
    { path: 'owner', select: memberFields },
    { path: 'members', select: memberFields }
  ]);

  res.json(project);
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  await Task.deleteMany({ project: project._id });
  await project.deleteOne();

  res.json({ message: 'Project deleted' });
});

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select(memberFields).sort({ name: 1 });
  res.json(users);
});
