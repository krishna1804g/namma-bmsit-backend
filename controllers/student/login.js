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

        const student = await prisma.student.findUnique({
            where: { email }
        });

        if(!student) {
            return res.status(404).jason({ error: 'student not found' })
        }

        const passwordMatch = await bcrypt.compare(password, student.password);

        if(!passwordMatch) {
            return res.status(401).jason({ error: 'Incorrect password' });
        }

        if(!student.isEmailVerified) {
            const otp = otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

            await prisma.student.update({
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
            if (!student.sessionId || jwt.verify(student.sessionId, process.env.JWT_SECRET).exp < Date.now() / 1000){
                // If no session ID or session ID has expired, generate a new token
                const token = jwt.sign({ studentId: student.id, email: student.email }, process.env.JWT_SECRET, { expiresIn: '1h' });


                await prisma.student.update({
                    where: { email },
                    data: {sessionId: token},
                })

                res.status(200).json({
                    message: 'Login successful',
                    data: {
                        id: student.id,
                        firstName: student.firstName,
                        lastName: student.last_name,
                        email: student.email,
                        isEmailVerified: student.isEmailVerified,
                        sessionId: token,
                    }
                });  
            } else {
                res.status(200).json({
                    message: 'Login successful',
                    data: {
                        id: student.id,
                        firstName: student.firstName,
                        lastName: student.last_name,
                        email: student.email,
                        isEmailVerified: student.isEmailVerified,
                        sessionId: student.sessionId,
                    }
                })
            }
        } catch(tokenError) {
            if(tokenError.name === 'TokenExpiredError'){
                // Token has expired, generate a new one
                const token = jwt.sign({ studentId: student.id, email: student.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

                await prisma.student.update({
                    where: { email },
                    data: { sessionId: token },
                });

                res.status(200).json({
                    message: 'Login successful',
                    data: {
                        id: student.id,
                        firstName: student.firstName,
                        lastName: student.last_name,
                        email: student.email,
                        isEmailVerified: student.isEmailVerified,
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