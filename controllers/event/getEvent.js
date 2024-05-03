const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const getEventController = async ( req, res ) => {
    try{
        const { id, title } = req.query;
        let event;
        // check for correct payload
        if(id){
            event = await prisma.event.findFirst({
                where: {id}
            })   
        } else if(title){
            event = await prisma.event.findUnique({
                where: {
                    title: title
                }
            })
        } else{
            event = await prisma.event.findMany()
        }

        if(!event){
            res.status(404).json({ error: 'Event not found' })
        }

        // after success
        console.log("event found: ", event)
        res.status(200).json({ event })

    } catch(error){
        res.status(500).json({ error: 'Internal server error.' })
    }
}


module.exports = getEventController