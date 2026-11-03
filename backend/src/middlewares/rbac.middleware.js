export const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado: El rol '${req.user.rol}' no tiene permisos suficientes para este recurso. Roles permitidos: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};
