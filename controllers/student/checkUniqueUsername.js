const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const checkUniqueUsernameController =  async (req, res) => {
    const { username } = req.body

    const student = await prisma.student.findUnique({
        where: {
            userName: username
        }
    })

    if(student){
        return res.status(400).json({ error: "username should be unique" })
    }

    return res.status(200).json({ success: "unique username", data : "" })
}

module.exports = checkUniqueUsernameController