
const { generateToken } = require("../utilities/auth");
const bcrypt = require('bcryptjs');
const passport = require('../config/passport-cfg');
const { body, validationResult } = require('express-validator');
const { authorizeUser } = require('../middleware/authorization');
const userService = require('../services/userService');


const loginUser = async (req, res) => {
  // TODO: validate input
  const { name, password } = req.body
  if (!name || !password) {
    return res.status(400).json({ error: 'name and password is required' });
  }

  try {
    const user = await userService.findUserByUsername(name, { includePassword: true });
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
    const users = await userService.getAllUsers(authorFilter);

    return res.status(200).json({ status: 'success', users });
  } catch (err) {
    return res.status(400).json({ error: 'Cannot fetch users data' });
  }
}

// TODO:
const validateUserForm = [
  body('password')
    .trim()
    .isLength({ min: 1 }).withMessage('Password must contain at least one character'),
];

const checkForValidationErrors = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

const registerUser = [
  validateUserForm,
  checkForValidationErrors,
  async (req, res) => {
    // TODO: add asyncHandler
    // TODO: add validation
    const {
      firstName,
      lastName,
      email,
      username,
      password,
    } = req.body;

    // TODO: check if there is already user with given email and password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userService.createUser({
      firstName, lastName, email, username, hashedPassword,
    });
    // TODO: maybe return jwt token the same as for login?
    const token = generateToken(user);
    res.json({ result: 'success', token });
  },
]

const getUserWithId = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const user = await userService.findUserById(id);
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
  authorizeUser,
  async (req, res) => {
    const { firstName, lastName } = req.body;

    const updatedData = {}

    if (firstName && firstName.trim()) {
      updatedData.firstName = firstName.trim();
    }
    if (lastName && lastName.trim()) {
      updatedData.lastName = lastName.trim();
    }

    const updatedUser = await userService.updateUser(req.user.id, ...updatedData);
    return res.json({
      status: 'success',
      user: updatedUser,
    });
  },
]

const deleteUserWithId = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await userService.deleteUserWithId(id);
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