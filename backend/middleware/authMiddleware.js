const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

exports.allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
};

exports.enforceWardScope = (req, res, next) => {
  if (req.user.role === 'admin') return next();

  if (req.user.role === 'coordinator') {
    const targetWard = req.params.wardId || req.body.ward || req.query.ward;
    if (targetWard && targetWard !== String(req.user.ward)) {
      return res.status(403).json({ message: 'Access denied: outside your assigned ward' });
    }
    return next();
  }

  return res.status(403).json({ message: 'Access denied' });
};
