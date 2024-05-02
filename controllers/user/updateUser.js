const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updateUserController = async (req, res) => {
  try {
    const { id, email } = req.query;
    const updateData = req.body;

    if (!id && !email) {
      return res.status(400).json({ error: 'Provide at least one of id or email' });
    }

    let user;

    if (id) {
      user = await prisma.user.update({
        where: { id: id },
        data: updateData,
      });
    } else if (email) {
      user = await prisma.user.update({
        where: { email: email },
        data: updateData,
      });
    } else {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      message: "Data updated",
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = updateUserController;
