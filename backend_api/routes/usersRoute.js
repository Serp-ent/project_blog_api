const { Router } = require('express');
const usersRoute = Router();

usersRoute.post('/login', (req, res) => {
  res.send('login route');
});

usersRoute.post('/register', (req, res) => {
  res.send('register route');
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