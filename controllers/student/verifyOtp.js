const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.otp !== otp) {
      return res.status(401).json({ error: 'Incorrect OTP' });
    }

    // OTP is correct, update the user record to mark email as verified
    await prisma.user.update({
      where: { email },
      data: { isEmailVerified: 1, otp: null },
    });

    return res.status(200).json({ 
      message: 'Email verified successfully',
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.last_name,
        email: user.email,
        isEmailVerified: 1,
        sessionId: user.sessionId,
    },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = verifyOtpController;
