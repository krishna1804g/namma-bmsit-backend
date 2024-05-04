const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const signupController = async (req, res) => {

    /*
  firstName
  lastName 
  userName   
  usn 
  deptartment    
  semister  
  phoneNo        
  email     
  password        
    */
    try {
        const data = req.body;
        console.log("random data: ", data)
        if (!data.email || !data.password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const existingStudent = await prisma.student.findUnique({
            where: { email: data.email },
        });

        if (existingStudent) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword
        
        const student = await prisma.student.create({
            data
        });

        return res.status(201).json({ message: 'Signup successful', studentId: student.id });
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = signupController;
