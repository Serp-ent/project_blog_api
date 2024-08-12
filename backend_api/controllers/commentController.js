const passport = require('../config/passport-cfg');
const commentService = require('../services/commentService');
const userService = require('../services/userService');
const postService = require('../services/postService');
const asyncHandler = require('express-async-handler');
const { NotFoundError } = require('../errors/errors');

const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const id = Number(req.params.id);
  const updatedComment = await commentService.updateComment(id, content);

  return res.json({ message: 'success', comment: updatedComment });
});

const deleteComment = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  commentService.deleteComment(id);
  return res.json({ message: "success" });
});

const getCommentsOfUser = asyncHandler(async (req, res) => {
  const authorId = Number(req.params.id);
  const userExist = await userService.findUserById(authorId);
  if (!userExist) {
    throw new NotFoundError('No user with given id');
  }

  const comments = await userService.getCommentsOfUser(authorId);
  res.json({ status: 'success', comments });
});

const getCommentsUnderPost = asyncHandler(async (req, res) => {
  const postId = Number(req.params.id);
  // Does post like this exists?
  const post = await postService.findPostById(postId);
  if (!post) {
    throw new NotFoundError("No post with given id");
  }

  const comments = await commentService.getCommentsUnderPost(postId);
  return res.json({ comments })
});

const addNewCommentUnderPost = [
  passport.authenticate('jwt', { session: false }),
  asyncHandler(async (req, res) => {
    // TODO: add validation
    const { content } = req.body;
    const postId = Number(req.params.id);
    const authorId = req.user.id;
    const comment = await commentService.addComment(postId, authorId, content);

    res.json({
      status: 'success',
      message: 'Comment created',
      comment
    });
  }),
]


module.exports = {
  updateComment,
  deleteComment,
  getCommentsOfUser,


  getCommentsUnderPost,
  addNewCommentUnderPost,
}
