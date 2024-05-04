const {PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient()

const getBookedEventsController = async (req, res) => {
    const { studentId } = req.body

    // get the student corresponding to that id
    const studentData = await prisma.student.findFirst({
        where: {
            studentId
        }
    })

    if(!studentData)
        return res.status(404).json({ error: 'Student Not Found with this id' })

    const bookingData = await prisma.eventBooking.findMany({
        where: {
            teamLeader: studentId
        }
    })

    if(!bookingData)
        return res.status(404).json({ error: 'No booked event found' })

    return res.status(200).json({ success: 'student booked event found', data: bookingData })

}

module.exports = getBookedEventsController