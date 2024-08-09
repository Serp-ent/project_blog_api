const { Router } = require('express');
const prisma = require('../db/prismaClient');
const usersRoute = Router();
const bcrypt = require('bcryptjs');

usersRoute.post('/login', (req, res) => {
  res.send('login route');
});

// TODO: add asyncHandler
usersRoute.post('/register', async (req, res) => {
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
});

usersRoute.get('/', (req, res) => {
  res.send('Get all users');
});

usersRoute.post('/', (req, res) => {
  res.send('create new user');
});

usersRoute.get('/:id', (req, res) => {
  res.send(`Send back user with id ${req.params.id}`);
});

usersRoute.put('/:id', (req, res) => {
  res.send(`Update info about user with id ${req.params.id}`);
});

usersRoute.delete('/:id', (req, res) => {
  res.send(`DELTE user with id ${req.params.id}`);
});

module.exports = usersRoute;