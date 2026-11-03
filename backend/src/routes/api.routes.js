import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import studentsRoutes from '../modules/students/students.routes.js';
import metricsRoutes from '../modules/metrics/metrics.routes.js';
import analyticsRoutes from '../modules/analytics/analytics.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/students', studentsRoutes);
router.use('/metrics', metricsRoutes);
router.use('/analytics', analyticsRoutes);

router.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    module: 'Learning Analytics API (Blended Learning)',
    timestamp: new Date().toISOString()
  });
});

export default router;
