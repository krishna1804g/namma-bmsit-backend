const express = require('express')
const loginController = require('../controllers/student/login')
const signupController = require('../controllers/student/signup')
const verifyOptController = require('../controllers/student/verifyOtp')
const sendOtpController = require('../controllers/student/sendOtp')
const getStudentController = require('../controllers/student/getStudent')
const updateStudentController = require('../controllers/student/updateStudent')
const forgotPasswordController = require('../controllers/student/forgotPassword')
const resetPasswordController = require('../controllers/student/resetPassword')
const changePasswordController = require('../controllers/student/changePassword')
const checkUniqueUsernameController = require('../controllers/student/checkUniqueUsername')
const router = express.Router()

router.post('/signin', loginController)
router.post('/signup', signupController)
router.post('/verifyOtp', verifyOptController)
router.post('/sendOtp', sendOtpController)
router.post('/getStudent', getStudentController)
router.post('/updatStudent', updateStudentController)
router.post('/checkUsername', checkUniqueUsernameController)
// complete forgot password, reset password
router.post('/forgotPassword', forgotPasswordController)
router.post('/resetPassword', resetPasswordController)
router.post('/changePassword', changePasswordController)



module.exports = router 