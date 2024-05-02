const express = require('express')
const loginController = require('../controllers/user/login')
const signupController = require('../controllers/user/signup')
const verifyOptController = require('../controllers/user/verifyOtp')
const sendOtpController = require('../controllers/user/sendOtp')
const getUserController = require('../controllers/user/getUser')
const updateUserController = require('../controllers/user/updateUser')
const forgotPasswordController = require('../controllers/user/forgotPassword')
const resetPasswordController = require('../controllers/user/resetPassword')
const changePasswordController = require('../controllers/user/changePassword')
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