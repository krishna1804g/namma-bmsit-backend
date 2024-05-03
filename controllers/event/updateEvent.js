const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient

const updateEventController = async (req, res) => {
    try{
        const id  = req.query;
        const updatedData = req.body;

        if(!id)
            res.status(400).json({ error: 'event id required' })

        const event = await prisma.event.update({
            where: {id},
            data: updatedData,
        })

        if(!event){
            res.status(404).json({ error: 'Event not found' })
        }

        return res.status(200).json({
            message: "Data updated",
            event
        });
    } catch(error) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

module.exports = updateEventController