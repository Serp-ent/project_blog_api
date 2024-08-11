const passport = require('../config/passport-cfg');

const authorizeUser = (req, res, next) => {
  if (req, user.id !== Number(req.params.id)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  next();
}

module.exports = {
  authorizeUser,
}