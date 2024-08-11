
const { Router } = require('express');
const postsRoute = Router();
const passport = require('passport');
const prisma = require('../db/prismaClient');

// TODO: add authentication

postsRoute.get('/', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({});
    return res.json({ posts });
  } catch (err) {
    res.status(404).json({ error: "Cannot fetch posts" });
  }
});

postsRoute.post('/', async (req, res) => {
  // TODO: get info from req.users 
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
});

postsRoute.get('/:id', async (req, res) => {
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
});

postsRoute.delete('/:id', async (req, res) => {
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
});

postsRoute.post('/:id', async (req, res) => {
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
});

postsRoute.put('/:id', (req, res) => {
  // TODO: 
  res.send('switch with new version of post');
});

postsRoute.get('/:id/comments', async (req, res) => {
  const postId = Number(req.params.id);
  try {
    // Does post like this exists?
    const exist = await prisma.post.findUnique({
      where: { id: postId },
    });
    if (!exist) {
      return res.status(404).json({ error: "No post with given id" });
    }

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        author: {
          select: {
            username: true,
            // TODO :maybe avatar
          }
        }
      },
    });

    return res.json({ comments })
  } catch (err) {
    res.status(400).json({ error: "Internal server error" });
  }
});


postsRoute.post('/:id/comments',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    // TODO: add validation
    const { content } = req.body;
    const postId = Number(req.params.id);
    const authorId = req.user.id;
    try {
      const comment = await prisma.comment.create({
        data: {
          authorId,
          postId,
          content,
        },
        include: {
          author: {
            select: {
              username: true,
            }
          }
        }
      });

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
);

module.exports = postsRoute;
