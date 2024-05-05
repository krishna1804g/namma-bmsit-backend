const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bookEventController = async (req, res) => {
    const bookingData = req.body;
        /* bookingData = {
        teamName : "legion" -> group / null -> individual
        studentId : uuid
        eventId : uuid
        studentUSN[]?
    } */
    console.log(bookingData)
    try {
        // Check if eventId and studentId are provided
        if (!bookingData.eventId || !bookingData.studentId) {
            return res.status(400).json({ error: 'EventId and studentId are required' });
        }

        // Start database transaction
        await prisma.$transaction(async (prisma) => {
            // Find the event to book
            const eventToBook = await prisma.event.findUnique({
                where: { id: bookingData.eventId }
            });

            if (!eventToBook) {
                return res.status(404).json({ error: 'Event not found' });
            }

            // Individual event booking
            if (eventToBook.perTeamParticipants === 1) {
                // Check if max booking reached
                const currentBookingCount = await prisma.eventBooking.count({
                    where: { event: bookingData.eventId }
                });

                if (currentBookingCount >= eventToBook.totalParticipants) {
                    return res.status(400).json({ error: 'Maximum bookings reached for this event' });
                }

                // check if student already registered
                const isStudentRegistered = await prisma.eventBooking.findUnique({
                    where: {teamLeader: bookingData.studentId}
                })

                if(isStudentRegistered)
                    return res.status(405).json({ error: "Already booked" })
                // Proceed with individual event booking
                const eventBooking = await prisma.eventBooking.create({
                    data: {
                        teamLeader: bookingData.studentId,
                        event: bookingData.eventId
                    }
                });

                return res.status(201).json({ success: 'Event booked', data: eventBooking });
            }

            // Group event booking
            else {
                const groupMembersCount = await prisma.groupEventMapping.count({
                    where:{
                        teamName: bookingData.teamName
                    }
                })
                // check if group does not exceed max members per team required
                if((bookingData.studentUsn).length + groupMembersCount - 1 > eventToBook.perTeamParticipants){
                    return res.status(400).json({ error: 'Maximum group memeber count reached for this event' });
                }
    
                // check if someone already booked with the team name and if its team leader again requesting
                const teamBooked = await prisma.eventBooking.findUnique({
                    where: {
                        teamName: bookingData.teamName
                    }
                })
                // check if first time booking
                if(!teamBooked){
                    const eventToBeBook = await prisma.eventBooking.create({
                        data: {
                            teamName: bookingData.teamName,
                            teamLeader: bookingData.studentId,
                            event: bookingData.eventId
                        }
                    })
    
                    console.log( "event to book: ", eventToBook )

                    for(const studentUsn of bookingData.studentUsn) {
                        const currentStudentToBook = await prisma.student.findUnique({
                            where: {
                                usn: studentUsn
                            }
                        })

                        if(!currentStudentToBook){
                            return res.status(404).json({ error: `Student with usn ${studentUsn} not found` });
                        }

                        const addToGroup = await prisma.groupEventMapping.create({
                            data: {
                                teamMember: currentStudentToBook.id,
                                teamName: bookingData.teamName,
                            }
                        })
                    }
    
                    return res.status(201).json({ success: "booked successfully", data: eventToBeBook })              
                }
    
                if(teamBooked && teamBooked.teamLeader != bookingData.studentId){
                    return res.status(403).json({ error: 'Only team leader allowed to book' })
                }
    
                
                // if team exists and team leader is bokoing go adead.
                for(const studentUsn of bookingData.studentUsn){
                    const currentStudentToBook = await prisma.student.findUnique({
                        where: {
                            usn: studentUsn
                        }
                    })

                    if(!currentStudentToBook){
                        return res.status(404).json({ error: `Student with username ${studentName} not found` });
                    }

                    const existingMapping = await prisma.groupEventMapping.findFirst({
                        where: {
                            teamMember: currentStudentToBook.id,
                            teamName: bookingData.teamName
                        }
                    });
                    if(!existingMapping){
                        await prisma.groupEventMapping.create({
                            data: {
                                teamMember: currentStudentToBook.id,
                                teamName: bookingData.teamName,
                            }
                        })
                    }
                }
                return res.status(201).json({ success: "booked successfully", data: eventToBook  })
            }
        });

    } catch (error) {
        console.error('Error booking event:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = bookEventController;