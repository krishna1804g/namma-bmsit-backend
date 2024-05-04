const router = require('express').Router()

const bookEventController = require('../controllers/eventBooking/bookEvent')

router.post('/', bookEventController)

module.exports = router