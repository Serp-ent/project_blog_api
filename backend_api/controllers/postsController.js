const passport = require('passport');
const prisma = require('../db/prismaClient')

const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({});
    return res.json({ posts });
  } catch (err) {
    res.status(404).json({ error: "Cannot fetch posts" });
  }
}

const createPost = async (req, res) => {
  const { title, content } = req.body;
  const authorId = req.user.id;

  try {
    const post = await prisma.post.create({
      data: {
        authorId,
        title,
        content,
      }
    });

    res.json({ message: "success", post });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Failed to create post" });
  }
}

const getPostWithId = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      return res.status(404).json({ error: `Post with id ${id} not found` });
    }

    return res.json({ message: "success", post });
  } catch (err) {
    return res.status(400).json({ error: 'Internal server error' });
  }
}

const deletePostWithId = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.post.delete({
      where: { id }
    });

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
    const post = await prisma.post.update({
      where: { id },
      data: {
        published: true,
      }
    });

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