const prisma = require('../db/prismaClient');

const findUserById = async (id) => {
  return prisma.user.findUnique({ where: { id } });
};

const createUser = async (userData) => {
  prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
    },
  });
}

module.exports = {
  createUser,
  findUserById,
}