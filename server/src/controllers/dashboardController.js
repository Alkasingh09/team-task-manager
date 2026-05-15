import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const projectQuery =
    req.user.role === 'admin'
      ? {}
      : {
          $or: [{ owner: req.user._id }, { members: req.user._id }]
        };
  const projects = await Project.find(projectQuery).select('title');
  const projectIds = projects.map((project) => project._id);
  const taskQuery = req.user.role === 'admin' ? {} : { assignedUser: req.user._id };
  const now = new Date();
  const [totalTasks, completedTasks, pendingTasks, inProgressTasks, overdueTasks, projectStats] =
    await Promise.all([
      Task.countDocuments(taskQuery),
      Task.countDocuments({ ...taskQuery, status: 'Completed' }),
      Task.countDocuments({ ...taskQuery, status: 'To Do' }),
      Task.countDocuments({ ...taskQuery, status: 'In Progress' }),
      Task.countDocuments({ ...taskQuery, status: { $ne: 'Completed' }, dueDate: { $lt: now } }),
      Task.aggregate([
        {
          $match: {
            project: { $in: projectIds },
            ...(req.user.role === 'member' ? { assignedUser: req.user._id } : {})
          }
        },
        {
          $group: {
            _id: '$project',
            total: { $sum: 1 },
            completed: {
              $sum: {
                $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0]
              }
            }
          }
        }
      ])
    ]);

  const statsByProject = new Map(projectStats.map((item) => [item._id.toString(), item]));
  const projectProgress = projects.map((project) => {
    const stats = statsByProject.get(project._id.toString()) || { total: 0, completed: 0 };
    const progress = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

    return {
      projectId: project._id,
      title: project.title,
      total: stats.total,
      completed: stats.completed,
      progress
    };
  });

  res.json({
    totalTasks,
    completedTasks,
    pendingTasks,
    inProgressTasks,
    overdueTasks,
    projectProgress
  });
});
