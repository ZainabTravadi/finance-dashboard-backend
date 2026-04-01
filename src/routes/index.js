import express from 'express';

const router = express.Router();

// Example route structure - add your routes here
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default router;
