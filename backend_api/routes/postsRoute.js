
const { Router } = require('express');
const postsRoute = Router();
const controller = require('../controllers/postsController');

// TODO: add authentication

postsRoute.get('/', controller.getAllPosts);
postsRoute.post('/', controller.createPost);

postsRoute.get('/:id', controller.getPostWithId);
postsRoute.delete('/:id', controller.deletePostWithId);
postsRoute.post('/:id', controller.publishPostWithId);

postsRoute.put('/:id', controller.updatePostWithId);

postsRoute.get('/:id/comments', controller.getCommentUnderPost);
postsRoute.post('/:id/comments', controller.addNewCommentUnderPost);

module.exports = postsRoute;
