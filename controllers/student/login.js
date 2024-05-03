const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kishi14g@gmail.com',
        pass: process.env.EMAIL_PASS,
    },
});

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ error: 'Email and Password required' })
        }

        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                company: true,
            },
        });

        if(!user) {
            return res.status(404).jason({ error: 'User not found' })
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if(!passwordMatch) {
            return res.status(401).jason({ error: 'Incorrect password' });
        }

        if(!user.isEmailVerified) {
            const otp = otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

            await prisma.user.update({
                    where: { email },
                    data: { otp },
                })

            console.log(otp)

            const mailOptions = {
                from: 'kishi14g@gmail.com',
                to: email,
                subject: 'Verification Code',
                text: `Your verification code is: ${ otp }`,
            };

            transporter.sendMail(mailOptions, ( error, info ) => {
                if ( error ) {
                    console.error('Email sending error:', error);
                    return res.status(500).json({error: 'Error sending verification email' });
                }
                console.log('Email sent: ', info.response);
                return res.status(403).json({ error: 'Verification code send' })
            })

        }

        try {
            console.log(process.env.JWT_SECRET)
            if (!user.sessionId || jwt.verify(user.sessionId, process.env.JWT_SECRET).exp < Date.now() / 1000){
                // If no session ID or session ID has expired, generate a new token
                const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });


                await prisma.user.update({
                    where: { email },
                    data: {sessionId: token},
                })

                res.status(200).json({
                    message: 'Login successful',
                    data: {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.last_name,
                        email: user.email,
                        isEmailVerified: user.isEmailVerified,
                        sessionId: token,
                    }
                });  
            } else {
                res.status(200).json({
                    message: 'Login successful',
                    data: {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.last_name,
                        email: user.email,
                        isEmailVerified: user.isEmailVerified,
                        sessionId: token,
                    }
                })
            }
        } catch(tokenError) {
            if(tokenError.name === 'TokenExpiredError'){
                // Token has expired, generate a new one
                const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

                await prisma.user.update({
                    where: { email },
                    data: { sessionId: token },
                });

                res.status(200).json({
                    message: 'Login successful',
                    data: {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.last_name,
                        email: user.email,
                        isEmailVerified: user.isEmailVerified,
                        sessionId: token,
                    },
                });
            } else {
                throw tokenError;
            }
        }
    } catch (error) {
        console.log('Login error', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = loginController