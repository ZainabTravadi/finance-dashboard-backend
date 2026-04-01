import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

// All user routes require authentication
router.use(authMiddleware);

// Admin only routes
router.get('/', authorize(['admin']), getAllUsers);
router.get('/:id', authorize(['admin']), getUserById);
router.patch('/:id', authorize(['admin']), updateUser);
router.delete('/:id', authorize(['admin']), deleteUser);

export default router;
