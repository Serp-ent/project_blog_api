const prisma = require("../db/prismaClient");
const { UnauthenticatedError, UnauthorizedError } = require("../errors/errors");
const asyncHandler = require('express-async-handler');

const authorizeUser = (req, res, next) => {
  if (!req.user) {
    throw new UnauthenticatedError();
  }

  if (req.user.id !== Number(req.params.id)) {
    throw new UnauthorizedError();
  }

  next();
}

const checkRole = (roles) => asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new UnauthenticatedError();
  }

  const user = await prisma.user.findUnique({
    where: {
      id: Number(req.user.id),
    },
    select: {
      role: true,
    }
  })
  if (!roles.includes(user.role.toUpperCase())) {
    throw new UnauthorizedError();
  }

  next();
});


module.exports = {
  authorizeUser,
  checkRole,
}