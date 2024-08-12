const prisma = require('../db/prismaClient');

const updateComment = async (id, content) => {
  return await prisma.comment.update({
    where: { id },
    data: {
      content,
    }
  });
}

const deleteComment = async (id) => {
  await prisma.comment.delete({
    where: { id },
  });
}

const getCommentsOfUser = async (userId) => {
  return await prisma.comment.findMany({
    where: { authorId: userId },
  });
}

const getCommentsUnderPost = async (postId) => {
  return await prisma.comment.findMany({
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
}

const addComment = async (postId, authorId, content) => {
  return await prisma.comment.create({
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
}

module.exports = {
  updateComment,
  deleteComment,
  getCommentsOfUser,
  getCommentsUnderPost,
  addComment,
}