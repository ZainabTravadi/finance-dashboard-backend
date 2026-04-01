import express from 'express';
import {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getMetrics,
} from '../controllers/dashboardController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

// All dashboard routes require authentication and admin/analyst roles
router.use(authMiddleware);
router.use(authorize(['admin', 'analyst']));

// Dashboard routes
router.get('/summary', getSummary);
router.get('/category', getCategoryBreakdown);
router.get('/trends', getMonthlyTrends);
router.get('/metrics', getMetrics);

export default router;
