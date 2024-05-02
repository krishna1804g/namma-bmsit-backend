const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getUserController = async (req, res) => {
  try {
    const { id, email } = req.query;

    let user;

    if (id) {
      user = await prisma.user.findUnique({
        where: { id: id },
      });
    } else if (email) {
      user = await prisma.user.findMany({
        where: {
          email: {
            contains: email,
          },
        },
      });
    } else {
      user = await prisma.user.findMany()
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.last_name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        sessionId: user.sessionId,
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = getUserController;
