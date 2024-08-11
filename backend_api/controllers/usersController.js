
const prisma = require('../db/prismaClient');
const { generateToken } = require("../utlilties/auth");
const bcrypt = require('bcryptjs');
const passport = require('passport');

const loginUser = async (req, res) => {
  // TODO: validate input
  const { name, password } = req.body
  if (!name || !password) {
    return res.status(400).json({ error: 'name and password is required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: name,
      }
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid name or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid name or password" });
    }

    // valid credentials
    const token = generateToken(user);
    return res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

const getAllUsers = async (req, res) => {
  const { role } = req.query;
  const authorFilter = role?.toLowerCase() === 'author' ? 'AUTHOR' : undefined;

  // TODO: add pagination
  try {
    const users = await prisma.user.findMany({
      where: {
        ...(authorFilter && { role: authorFilter })
      },
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

    return res.status(200).json({ status: 'success', users });
  } catch (err) {
    return res.status(400).json({ error: 'Cannot fetch users data' });
  }
}

const registerUser = async (req, res) => {
  // TODO: add asyncHandler
  // TODO: add validation
  // TODO: add password hashing
  const {
    firstName,
    lastName,
    email,
    username,
    password,
  } = req.body;

  // TODO: check if there is already user with given email and password
  hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
    },
  });

  // TODO: maybe return jwt token the same as for login?
  res.json({ result: 'success' });
};

const getUserWithId = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        role: true,
        registeredAt: true,
      },
    });
    if (!user) {
      return res.status(404).json({ error: `user with id ${id} not found` });
    }

    return res.json({ status: 'success', user });
  } catch (err) {
    res.status(400).json({ error: 'An error occurred while fetching the user' });
  }
}

const updateUserWithId = [
  // TODO: add validation
  passport.authenticate('jwt', { session: false }),

  (req, res, next) => {
    if (req.user.id !== Number(req.params.id)) {
      return res.json({ error: 'Unauthorized' });
    }

    next();
  },

  async (req, res) => {
    const { firstName, lastName } = req.body;

    const updatedData = {}

    if (firstName && firstName.trim()) {
      updatedData.firstName = firstName.trim();
    }
    if (lastName && lastName.trim()) {
      updatedData.lastName = lastName.trim();
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: updatedData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        role: true,
        registeredAt: true,
      },
    });

    return res.json({
      status: 'success',
      user: updatedUser,
    });
  },
]

const deleteUserWithId = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.user.delete({ where: { id } });
    res.json({ message: `User with id ${id} deleted successfully` });
  } catch (err) {
    res.status(400).json({ error: `Error deleting user with id ${id}` });
  }
}

module.exports = {
  loginUser,
  registerUser,

  getAllUsers,
  getUserWithId,
  updateUserWithId,
  deleteUserWithId,
}