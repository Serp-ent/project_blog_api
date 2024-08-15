const prisma = require('../db/prismaClient');
const { NotFoundError, ValidationError } = require('../errors/errors');
const { ensureIdIsNumber } = require('../middleware/ensureIdIsNumber');
const postService = require('../services/postService');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const getAllPosts = asyncHandler(async (req, res) => {
  let { page, limit } = req.query;
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 10;

  const offset = (page - 1) * limit;

  const posts = await postService.getAllPosts({ skip: offset, take: limit });
  const totalPosts = await postService.countPosts();

  return res.json({
    status: 'success',
    posts,
    page,
    limit,
    totalPosts,
    totalPages: Math.ceil(totalPosts / limit),
  });
});

// TODO: create distinct validation file 
const validatePost = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 255 }).withMessage('Title must be at least 5 characters long and 255 at most'),

  body('content')
    .trim()
    .notEmpty().withMessage('Content is required')
    .isLength({ min: 20 }).withMessage('Content must be at least 20 characters long'),
]

const checkForValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array().at(0).msg);
  }

  next();
}

const createPost = [
  validatePost,
  checkForValidationErrors,
  asyncHandler(async (req, res) => {
    const { title, content } = req.body;
    const authorId = req.user.id;

    const post = await postService.createPost(authorId, title, content);
    res.json({ status: "success", post });
  })
]

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
  const { publishState } = req.body;

  const post = await postService.setPublishStateOfPost(id, publishState);

  const visibility = post.published ? 'published' : 'hidden';
  return res.json({ message: `post ${id} is now ${visibility}` });
})

const updatePostWithId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        // only update if provided
        title: title || undefined,
        content: content || undefined,
      }
    })

    return res.json({
      status: 'success',
      post,
    });

  } catch (err) {
    if (err.code === 'P2025') {
      throw NotFoundError('Post not found');
    }
    throw err;
  }
});

module.exports = {
  getAllPosts,
  createPost,
  getPostWithId,
  deletePostWithId,
  publishPostWithId,
  updatePostWithId,

}