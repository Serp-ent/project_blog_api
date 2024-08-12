const prisma = require('../db/prismaClient');

const findPostById = async (id) => {
  return await prisma.post.findUnique({
    where: { id },
  });
}


module.exports = {
  findPostById,
}