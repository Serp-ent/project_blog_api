const { Router } = require('express');
const usersRoute = Router();

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