
const prisma = require('../db/prismaClient');
const { Router } = require('express');
const commentsRoute = Router();
const controller = require('../controllers/commentController');

commentsRoute.put('/:id', controller.updateComment);
commentsRoute.delete('/:id', controller.deleteComment);

module.exports = commentsRoute;