const prisma = require('../db/prismaClient');

const findUserById = async (id, options = {}) => {
  const { includePassword = false } = options;

  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      username: true,
      password: includePassword,
      role: true,
      registeredAt: true,
    },
  });
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

const findUserByUsername = async (username, { includePassword = false }) => {
  return await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      username: true,
      password: includePassword,
      role: true,
      registeredAt: true,
    },
  });
}

const getAllUsers = async (role) => {
  return await prisma.user.findMany({
    where: { role },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      username: true,
      role: true,
      registeredAt: true,
    },
  })
}

const updateUser = async (id, { includePassword = false, ...updatedData }) => {
  return await prisma.user.update({
    where: { id },
    data: updatedData,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      username: true,
      password: includePassword,
      role: true,
      registeredAt: true,
    },
  });
}

const deleteUserWithId = async (id) => {
  await prisma.user.delete({ where: { id } });
}

module.exports = {
  createUser,
  findUserById,
  findUserByUsername,
  getAllUsers,
  updateUser,
  deleteUserWithId,
}