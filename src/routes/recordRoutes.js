import express from 'express';
import {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} from '../controllers/recordController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Read routes (Admin and Analyst)
router.get('/', authorize(['admin', 'analyst']), getRecords);
router.get('/:id', authorize(['admin', 'analyst']), getRecordById);

// Write routes (Admin only)
router.post('/', authorize(['admin']), createRecord);
router.put('/:id', authorize(['admin']), updateRecord);
router.delete('/:id', authorize(['admin']), deleteRecord);

export default router;
