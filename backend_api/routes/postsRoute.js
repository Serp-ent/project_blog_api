
const { Router } = require('express');
const postsRoute = Router();
const controller = require('../controllers/postsController');
const commentController = require('../controllers/commentController');
const passport = require('../config/passport-cfg');

// TODO: add authentication
postsRoute.get('/', controller.getAllPosts);

postsRoute.post('/',
  passport.authenticate('jwt', { session: false }),
  controller.createPost,
);

postsRoute.get('/:id', controller.getPostWithId);
postsRoute.delete('/:id', controller.deletePostWithId);
postsRoute.post('/:id', controller.publishPostWithId);

postsRoute.put('/:id', controller.updatePostWithId);

postsRoute.get('/:id/comments', commentController.getCommentsUnderPost);
postsRoute.post('/:id/comments', commentController.addNewCommentUnderPost);

module.exports = postsRoute;
