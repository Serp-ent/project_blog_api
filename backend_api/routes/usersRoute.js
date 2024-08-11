const { Router } = require('express');
const usersRoute = Router();
const controller = require('../controllers/usersController');
const commentController = require('../controllers/commentController');

usersRoute.post('/login', controller.loginUser);
usersRoute.post('/', controller.registerUser);

usersRoute.get('/', controller.getAllUsers);
usersRoute.get('/:id', controller.getUserWithId);
usersRoute.put('/:id', controller.updateUserWithId);
usersRoute.delete('/:id', controller.deleteUserWithId);

usersRoute.get('/:id/comments', commentController.getCommentsOfUser);

module.exports = usersRoute;