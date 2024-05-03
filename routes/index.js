const router = require('express').Router()
const studentRouter = require('./student.router')
const eventRouter = require('./event.router')

router.use('/user', studentRouter)
router.use('/event', eventRouter)

module.exports = router;