const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const resetPasswordController = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (otp !== user.otp) {
      return res.status(401).json({ error: 'Incorrect OTP' });
    }

    
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword, otp: null },
    });

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = resetPasswordController;
