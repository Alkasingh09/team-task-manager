import express from 'express';
import { body, param, query } from 'express-validator';
import { createTask, deleteTask, getTasks, updateTask } from '../controllers/taskController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.use(protect);

router.get(
  '/',
  [
    query('status').optional().isIn(['To Do', 'In Progress', 'Completed']),
    query('priority').optional().isIn(['Low', 'Medium', 'High']),
    query('project').optional().isMongoId(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validateRequest,
  getTasks
);
router.post(
  '/',
  requireAdmin,
  [
    body('title').trim().notEmpty().withMessage('Task title is required'),
    body('description').trim().notEmpty().withMessage('Task description is required'),
    body('priority').isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority'),
    body('status').optional().isIn(['To Do', 'In Progress', 'Completed']).withMessage('Invalid status'),
    body('dueDate').isISO8601().toDate().withMessage('Valid due date is required'),
    body('project').isMongoId().withMessage('Valid project is required'),
    body('assignedUser').isMongoId().withMessage('Valid assigned user is required')
  ],
  validateRequest,
  createTask
);
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid task id'),
    body('title').optional().trim().notEmpty().withMessage('Task title cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Task description cannot be empty'),
    body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority'),
    body('status').optional().isIn(['To Do', 'In Progress', 'Completed']).withMessage('Invalid status'),
    body('dueDate').optional().isISO8601().toDate().withMessage('Valid due date is required'),
    body('assignedUser').optional().isMongoId().withMessage('Valid assigned user is required'),
    body('markedOverdue').optional().isBoolean().withMessage('markedOverdue must be boolean')
  ],
  validateRequest,
  updateTask
);
router.delete(
  '/:id',
  requireAdmin,
  param('id').isMongoId().withMessage('Invalid task id'),
  validateRequest,
  deleteTask
);

export default router;
