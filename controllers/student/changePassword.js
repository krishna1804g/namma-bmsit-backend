const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const changePasswordController = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Email, Old Password, and new password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

   const passwordMatch = await bcrypt.compare(oldPassword,user.password)

   if(!passwordMatch){
    return res.status(401).json({message:"Old password is incorrect.If you don't know reset your password"})
   }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword, otp: null },
    });

    return res.status(200).json({ message: 'Password changed successful' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = changePasswordController;
