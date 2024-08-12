const prisma = require('../db/prismaClient');

const findPostById = async (id) => {
  return await prisma.post.findUnique({
    where: { id },
  });
}

const getAllPosts = async () => {
  return await prisma.post.findMany({});
}

const createPost = async (authorId, title, content) => {
  return await prisma.post.create({
    data: {
      authorId,
      title,
      content,
    }
  });
}

const getPostWithId = async (id) => {
  return await prisma.post.findUnique({
    where: { id }
  });
}

const deletePostWithId = async (id) => {
  await prisma.post.delete({
    where: { id }
  });
}

const setPublishStateOfPost = async (id, publishState) => {
  await prisma.post.update({
    where: { id },
    data: {
      published: publishState,
    }
  });
}


module.exports = {
  findPostById,
  getAllPosts,
  createPost,
  getPostWithId,
  deletePostWithId,
  setPublishStateOfPost,
}