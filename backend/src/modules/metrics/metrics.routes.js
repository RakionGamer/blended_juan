import { Router } from 'express';
import multer from 'multer';
import { MetricsController } from './metrics.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { requireRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();

// Configuración de multer en memoria para procesar archivos directamente con xlsx
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024 // 20 MB máx
  }
});

// Descargar plantilla CSV / Excel (Público autenticado)
router.get('/template', verifyToken, MetricsController.downloadTemplate);

// Ingesta individual vía JSON
router.post('/ingest', verifyToken, requireRoles('Administrador', 'Coordinador'), MetricsController.ingest);

// Ingesta masiva por lotes vía archivo CSV o Excel (Drag & Drop)
router.post(
  '/import-file',
  verifyToken,
  requireRoles('Administrador', 'Coordinador'),
  upload.single('file'),
  MetricsController.importFile
);

export default router;
