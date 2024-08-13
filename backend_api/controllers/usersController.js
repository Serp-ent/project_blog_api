
const { generateToken } = require("../utilities/auth");
const bcrypt = require('bcryptjs');
const passport = require('../config/passport-cfg');
const { body, validationResult } = require('express-validator');
const { authorizeUser } = require('../middleware/authorization');
const userService = require('../services/userService');
const { UnauthenticatedError, ValidationError, NotFoundError, AppError } = require("../errors/errors");
const asyncHandler = require('express-async-handler');
const checkUserExists = require("../middleware/checkUserExists");

const loginUser = asyncHandler(async (req, res) => {
  // TODO: validate input
  const { name, password } = req.body
  if (!name || !password) {
    return res.status(400).json({ error: 'name and password is required' });
  }

  const user = await userService.findUserByUsername(name, { includePassword: true });
  if (!user) {
    throw new UnauthenticatedError('Invalid name or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new UnauthenticatedError('Invalid name or password');
  }

  // valid credentials
  const token = generateToken(user);
  return res.status(200).json({ token });
})

const getAllUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;
  // TODO: getValidRoles from the database
  const validRoles = ['AUTHOR', 'READER']

  const roleFilter = role?.toUpperCase();
  if (role && !validRoles.includes(roleFilter)) {
    throw new AppError('Invalid role query parameter', 400);
  }

  // TODO: add pagination
  const users = await userService.getAllUsers(roleFilter);
  return res.status(200).json({ status: 'success', users });
})

// firstName,
// lastName,
// email,
// username,
// password,
const validateUserForm = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2 }).withMessage('First name must be at least 2 characters long'),

  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 2 }).withMessage('Last name must be at least 2 characters long'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address'),

  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),

  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*]/).withMessage('Password must contain at least one special character (!@#$%^&*)'),

  body('passwordConfirm')
    .trim()
    .notEmpty().withMessage('Password confirmation is required')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords must match'),
];

const checkForValidationErrors = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    // throw only the first error
    throw new ValidationError(errors.array().at(0).msg);
  }

  next();
});

const registerUser = [
  validateUserForm,
  checkForValidationErrors,
  checkUserExists,
  asyncHandler(async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      username,
      password,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userService.createUser({
      firstName, lastName, email, username, hashedPassword,
    });

    const token = generateToken(user);
    res.json({ result: 'success', token });
  }),
]

// TODO: maybe split logic to check if user exists
const getUserWithId = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const user = await userService.findUserById(id);
  if (!user) {
    throw new NotFoundError(`user with id ${id} not found`);
  }

  return res.json({ status: 'success', user });
})

// TODO: maybe split logic to check if user exists
const updateUserWithId = [
  // TODO: add validation
  passport.authenticate('jwt', { session: false }),
  authorizeUser,
  asyncHandler(async (req, res) => {
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
  }),
]

// TODO: maybe split logic to check if user exists
const deleteUserWithId = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  await userService.deleteUserWithId(id);
  res.json({ message: `User with id ${id} deleted successfully` });
})

module.exports = {
  loginUser,
  registerUser,

  getAllUsers,
  getUserWithId,
  updateUserWithId,
  deleteUserWithId,
}