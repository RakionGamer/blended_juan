import { Router } from 'express';
import { StudentsController } from './students.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';

const router = Router();

// Accesible por cualquier usuario autenticado (Admin, Coordinador, Docente)
router.get('/', verifyToken, StudentsController.list);
router.get('/:id', verifyToken, StudentsController.getById);

export default router;
