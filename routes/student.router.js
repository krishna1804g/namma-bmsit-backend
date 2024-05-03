const express = require('express')
const loginController = require('../controllers/student/login')
const signupController = require('../controllers/student/signup')
const verifyOptController = require('../controllers/student/verifyOtp')
const sendOtpController = require('../controllers/student/sendOtp')
const getUserController = require('../controllers/student/getUser')
const updateUserController = require('../controllers/student/updateUser')
const forgotPasswordController = require('../controllers/student/forgotPassword')
const resetPasswordController = require('../controllers/student/resetPassword')
const changePasswordController = require('../controllers/student/changePassword')
const router = express.Router()

router.post('/signIn', loginController)
router.post('/signUp', signupController)
router.post('/verifyOtp', verifyOptController)
router.post('/sendOtp', sendOtpController)
router.post('/getUser', getUserController)
router.post('/updateUser', updateUserController)
// complete forgot password, reset password
router.post('/forgotPassword', forgotPasswordController)
router.post('/resetPassword', resetPasswordController)
router.post('/changePassword', changePasswordController)



module.exports = router 