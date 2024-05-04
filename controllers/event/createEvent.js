const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()


const createEventController = async ( req, res ) => {
    try{
        const data = req.body;
    
        // check for data
        if(!data.title && !data.description)
            res.status(400).json({ error: 'Event title and description required' })
        
        // check of existing event
        const existingEvent = await prisma.event.findFirst({
            where: { title: data.title }
        })
    
        if(existingEvent)
            res.status(409).json({ error: 'Event title already exists' })
    
        // add this event to db
        const newEvent = await prisma.event.create({
            data
        })

        console.log("CreatedEvent: ", newEvent)
        // return 201 status for success
        res.status(201).json({ success: 'Event created successfully' })

    } catch(error){
        console.log(error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

module.exports = createEventController