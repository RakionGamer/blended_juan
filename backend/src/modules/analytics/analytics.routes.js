import { Router } from 'express';
import { AnalyticsController } from './analytics.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { requireRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();

// Dashboard disponible para todos los roles autenticados
router.get('/dashboard', verifyToken, AnalyticsController.getDashboard);

// Rendimiento del modelo (Curva ROC y métricas ML)
router.get('/model-performance', verifyToken, AnalyticsController.getModelPerformance);

// Re-evaluación restringida a Administrador y Coordinador
router.post('/evaluate/:studentId', verifyToken, requireRoles('Administrador', 'Coordinador'), AnalyticsController.evaluate);

export default router;
