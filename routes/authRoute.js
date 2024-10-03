import express from 'express'
import { register, verifyAccount, login, getUser, forgotPassword,verifyTokenResetPassword, updatePassword, admin } from '../controllers/authController.js'
import authMiddleware from '../middleware/authMiddleware.js'
const router = express.Router()

//Routes for user authentication and registration.
router.post('/register',register)
router.get('/verify/:token',verifyAccount)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)

router.route('/forgot-password/:token')
    .get(verifyTokenResetPassword)
    .post(updatePassword)

//private area -requires a JTWS
router.get('/user', authMiddleware, getUser)
router.get('/admin', authMiddleware, admin)

export default router;