const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const otpGenerator = require('otp-generator');
const sendOtpController = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const otp = otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

        // Update user record with OTP and set OTP expiry (e.g., 5 minutes)
        //const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes
        await prisma.user.update({
            where: { email },
            data: { otp },
        });
        

        return res.status(200).json({ message: 'OTP sent to Email successfully' });
    } catch (error) {
        console.error('send OTP error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = sendOtpController;
