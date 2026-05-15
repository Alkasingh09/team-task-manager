import express from 'express';
import { body, param } from 'express-validator';
import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  listUsers,
  updateProject
} from '../controllers/projectController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.use(protect);

router.get('/users', requireAdmin, listUsers);
router.get('/', getProjects);
router.post(
  '/',
  requireAdmin,
  [
    body('title').trim().notEmpty().withMessage('Project title is required'),
    body('description').trim().notEmpty().withMessage('Project description is required'),
    body('members').optional().isArray().withMessage('Members must be an array')
  ],
  validateRequest,
  createProject
);
router.get('/:id', param('id').isMongoId().withMessage('Invalid project id'), validateRequest, getProject);
router.put(
  '/:id',
  requireAdmin,
  [
    param('id').isMongoId().withMessage('Invalid project id'),
    body('title').optional().trim().notEmpty().withMessage('Project title cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Project description cannot be empty'),
    body('members').optional().isArray().withMessage('Members must be an array')
  ],
  validateRequest,
  updateProject
);
router.delete(
  '/:id',
  requireAdmin,
  param('id').isMongoId().withMessage('Invalid project id'),
  validateRequest,
  deleteProject
);

export default router;
