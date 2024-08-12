const postService = require('../services/postService');

const getAllPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    return res.json({ posts });
  } catch (err) {
    res.status(404).json({ error: `Cannot fetch posts ${err.message}` });
  }
}

const createPost = async (req, res) => {
  const { title, content } = req.body;
  const authorId = req.user.id;

  try {
    const post = await postService.createPost(authorId, title, content);
    res.json({ message: "success", post });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Failed to create post" });
  }
}

const getPostWithId = async (req, res) => {
  const id = Number(req.params.id);
  try {

    const post = await postService.getPostWithId(id);

    if (!post) {
      return res.status(404).json({ error: `Post with id ${id} not found` });
    }

    return res.json({ message: "success", post });
  } catch (err) {
    return res.status(400).json({ error: `Internal server error ${err.message}` });
  }
}

const deletePostWithId = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await postService.deletePostWithId(id);

    return res.json({ message: 'post deleted' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.json({ message: 'post deleted' });
    }

    return res.status(400).json({ error: 'Internal server error' });
  }
}

const publishPostWithId = async (req, res) => {
  // TODO: add query parameter to hide post
  const id = Number(req.params.id);
  try {
    const post = await postService.setPublishStateOfPost(id, true);

    const visibility = post.published ? 'published' : 'hidden';
    return res.json({ message: `post ${id} is now ${visibility}` });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.json({ message: `Post with id ${id} not found` });
    }
    return res.json({ error: "Internal server error" });
  }
}

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