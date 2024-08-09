const { Router } = require('express');
const prisma = require('../db/prismaClient');
const usersRoute = Router();
const bcrypt = require('bcryptjs');
const { generateToken } = require("../utlilties/auth");

usersRoute.post('/login', async (req, res) => {
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
});


usersRoute.get('/', async (req, res) => {
  // TODO: add pagination
  try {
    const users = await prisma.user.findMany({})
    console.log(users);
    res.status(200).json({ users });
  } catch (err) {
    res.status(400).json({ error: 'Cannot fetch users data' });
  }
});

// TODO: add asyncHandler
usersRoute.post('/', async (req, res) => {
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

usersRoute.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: `user with id ${id} not found` });
    }
    return res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'An error occured while fetching the user' });
  }
});

usersRoute.put('/:id', (req, res) => {
  // TODO:
  res.send(`[TODO]: Update info about user with id ${req.params.id}`);
});

usersRoute.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  console.log('deleting user with id', id);
  try {
    await prisma.user.delete({ where: { id } });
    res.json({ message: `User with id ${id} deleted successfully` });
  } catch (err) {
    res.status(400).json({ error: `Error deleting user with id ${id}` });
  }
});

module.exports = usersRoute;