const express = require('express')
const router = express.Router()

const createEventController = require('../controllers/event/createEvent')
const getEventController = require('../controllers/event/getEvent')
const updateEventController = require('../controllers/event/updateEvent')

router.post('/', createEventController)
router.get('/', getEventController)
router.put('/', updateEventController)

module.exports = router