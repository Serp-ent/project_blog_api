const prisma = require('../db/prismaClient');

const updateComment = async (req, res) => {
  const { content } = req.body;
  const id = Number(req.params.id);
  try {
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: {
        content,
      }
    });

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
    await prisma.comment.delete({
      where: { id },
    });

    return res.json({ message: "success" });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "Not found" });
    }
    return res.status(400).json({ error: "Failed to remove comment" });
  }
}

module.exports = {
  updateComment,
  deleteComment,
}
