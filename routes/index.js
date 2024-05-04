const router = require('express').Router()
const studentRouter = require('./student.router')
const eventRouter = require('./event.router')
const eventBookingRouter = require('./eventBooking.router')

router.use('/student', studentRouter)
router.use('/event', eventRouter)
router.use('/eventBooking', eventBookingRouter)

module.exports = router;