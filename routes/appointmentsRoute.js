import express from 'express'
import {createAppointment, getAppointmentByDate, getAppointmentById,updateAppointment, deleteAppointment} from '../controllers/appointmentController.js'
import Middleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.route("/")
    .post(Middleware,createAppointment)
    .get(Middleware,getAppointmentByDate)

router.route("/:id")
    .get(Middleware, getAppointmentById)
    .put(Middleware,updateAppointment)
    .delete(Middleware,deleteAppointment)



export default router;