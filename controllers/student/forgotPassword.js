const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// const transporter = nodemailer.createTransport({
//   Configure your email transport settings (e.g., SMTP)
// See nodemailer documentation for options: https://nodemailer.com/about/
// });

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const otp = otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    console.log(otp)

    await prisma.user.update({
      where: { email },
      data: { otp },
    });

    // const mailOptions = {
    //   from: 'your-email@example.com', 
    //   to: email,
    //   subject: 'Forgot Password OTP',
    //   text: `Your OTP for password reset is: ${otp}`,
    // };

    //await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'OTP sent to email for password reset' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = forgotPasswordController;
