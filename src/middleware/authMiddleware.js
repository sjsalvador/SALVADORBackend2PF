export const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ status: 'error', message: 'Acceso denegado: se requiere rol de administrador' });
};

export const authorizeUser = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    return next();
  }
  return res.status(403).json({ status: 'error', message: 'Acceso denegado: se requiere estar autenticado como usuario' });
};
