const asyncHandler = require('express-async-handler');
const userService = require('../services/userService');
const { ConflictError } = require('../errors/errors');

const checkUserExists = asyncHandler(async (req, res, next) => {
  const { email, username } = req.body;

  const [emailUsed, userNameUsed] = await Promise.all([
    userService.findUserByEmail(email, {}),
    userService.findUserByUsername(username, {}),
  ]);

  if (emailUsed || userNameUsed) {
    const used = emailUsed ? 'Email' : 'Username'
    throw new ConflictError(`${used} already exists`);
  }

  next();
});

module.exports = checkUserExists;