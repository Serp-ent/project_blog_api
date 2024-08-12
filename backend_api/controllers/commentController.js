const passport = require('../config/passport-cfg');
const commentService = require('../services/commentService');
const userService = require('../services/userService');
const postService = require('../services/postService');

const updateComment = async (req, res) => {
  const { content } = req.body;
  const id = Number(req.params.id);
  try {
    const updatedComment = await commentService.updateComment(id, content);

    return res.json({ message: 'success', comment: updatedComment });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.json({ error: "No comment with given id" });
    }
    return res.status(400).json({ error: "Comment update failed" });
  }
}

const deleteComment = async (req, res) => {
  const id = Number(req.params.id);
  try {
    commentService.deleteComment(id);

    return res.json({ message: "success" });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "Not found" });
    }
    return res.status(400).json({ error: "Failed to remove comment" });
  }
}

const getCommentsOfUser = async (req, res) => {
  const authorId = Number(req.params.id);
  try {
    const userExist = await userService.findUserById(authorId);
    if (!userExist) {
      return res.status(404).json({ status: 'error', error: 'No user with given id' });
    }

    const comments = await userService.getCommentsOfUser(authorId);
    res.json({ status: 'success', comments });
  } catch (err) {
    res.status(400).json({ error: `Error deleting user with id ${authorId} ${err.message}` });
  }
}

const getCommentsUnderPost = async (req, res) => {
  const postId = Number(req.params.id);
  try {
    // Does post like this exists?
    const post = await postService.findPostById(postId);
    if (!post) {
      return res.status(404).json({ error: "No post with given id" });
    }

    const comments = await commentService.getCommentsUnderPost(postId);
    return res.json({ comments })
  } catch (err) {
    res.status(400).json({ error: `Internal server error ${err.message}` });
  }
}

const addNewCommentUnderPost = [
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    // TODO: add validation
    const { content } = req.body;
    const postId = Number(req.params.id);
    const authorId = req.user.id;
    try {
      const comment = await commentService.addComment(postId, authorId, content);

      res.json({
        status: 'success',
        message: 'Comment created',
        comment
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Failed to post a comment" })
    }
  },
]


module.exports = {
  updateComment,
  deleteComment,
  getCommentsOfUser,


  getCommentsUnderPost,
  addNewCommentUnderPost,
}
