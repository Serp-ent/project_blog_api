const authorizeUser = (req, res, next) => {
  if (!res.user) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }

  if (req.user.id !== Number(req.params.id)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  next();
}

const checkRole = (roles) => (req, res, next) => {
  if (!res.user) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};


module.exports = {
  authorizeUser,
  checkRole,
}