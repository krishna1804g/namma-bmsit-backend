const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const getEventController = async ( req, res ) => {
    try{
        const { id } = req.query;
    
        // check for correct payload
        if(!id){
            res.status(400).json({ error: 'Id required' })
        }

        const event = await prisma.event.findFirst({
            where: {id}
        })

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