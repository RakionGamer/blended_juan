import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token de autenticación no proporcionado. Se requiere encabezado Authorization: Bearer <token>'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded; // { id, email, rol, nombre }
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Token de autenticación inválido o expirado'
    });
  }
};
