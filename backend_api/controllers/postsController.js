const { NotFoundError } = require('../errors/errors');
const { ensureIdIsNumber } = require('../middleware/ensureIdIsNumber');
const postService = require('../services/postService');
const asyncHandler = require('express-async-handler');

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await postService.getAllPosts();
  return res.json({ status: 'success', posts });
});

const createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const authorId = req.user.id;

  const post = await postService.createPost(authorId, title, content);
  res.json({ message: "success", post });
})

const getPostWithId = [
  ensureIdIsNumber,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const post = await postService.getPostWithId(id);
    if (!post) {
      throw new NotFoundError('Post not found');
    }

    return res.json({ status: "success", post });
  })
];

const deletePostWithId = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  await postService.deletePostWithId(id);
  return res.json({ message: 'post deleted' });
})

const publishPostWithId = asyncHandler(async (req, res) => {
  // TODO: add query parameter to hide post
  const id = Number(req.params.id);
  const post = await postService.setPublishStateOfPost(id, true);

  const visibility = post.published ? 'published' : 'hidden';
  return res.json({ message: `post ${id} is now ${visibility}` });
})

const updatePostWithId = (req, res) => {
  // TODO: 
  res.send('switch with new version of post');
}

module.exports = {
  getAllPosts,
  createPost,
  getPostWithId,
  deletePostWithId,
  publishPostWithId,
  updatePostWithId,

}