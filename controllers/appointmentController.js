import Appointment from "../models/Appointment.js";
import { parse, formatISO, startOfDay, endOfDay, isValid } from "date-fns";
import {
  handleFoundErro,
  validateObjetId,
  formatterDate,
} from "../utils/index.js";
import {
  sendEmailNewAppointment,
  sendEmailUpdateAppointment,
  sendEmailDeleteAppointment,
} from "../emails/appointmentEmailService.js";

const createAppointment = async (req, res) => {
  try {
    if (Object.values(req.body).includes("")) {
      return res.json({ msg: "Hay campos vacíos, no se pudo grabar" });
    }
    const data = req.body;
    data.user = req.user._id.toString();

    const appointment = new Appointment(data);

    const results = await appointment.save();

    const date = formatterDate(results.date);
    await sendEmailNewAppointment({
      date,
      time: results.time,
    });

    res.json({ msg: "Cita almacenada correctamente" });
  } catch {
    const error = new Error("Algo ha salido mal, no se guardó la cita");
    res.status(401).json({ msg: error.message });
    console.log(error);
  }
};

const getAppointmentByDate = async (req, res) => {
  const { date } = req.query;
  const newDate = parse(date, "dd/MM/yyyy", new Date());

  if (!isValid(newDate)) {
    const error = new Error("Fecha no válida");
    return res.status(400).json({ msg: error.message });
  }
  const isoDate = formatISO(newDate);

  const appointments = await Appointment.find({
    date: {
      $gte: startOfDay(new Date(isoDate)),
      $lte: endOfDay(new Date(isoDate)),
    },
  }).select("time");
  res.json(appointments);
};

const getAppointmentById = async (req, res) => {
  const { id } = req.params;

  //validate appointment id
  if (validateObjetId(id, res)) return;

  try {
    const appointment = await Appointment.findById(id).populate("services");

    //validate if the appointment exist
    if (appointment.user.toString() !== req.user._id.toString()) {
      const error = new Error("Acceso no válido");
      return res.status(403).json({ msg: error.message });
    }
    if (!appointment) {
      return handleFoundErro("La cita no existe", res);
    }

    res.json(appointment);
  } catch (error) {
    console.log(error);
  }
};

const updateAppointment = async (req, res) => {
  const { id } = req.params;
  if (validateObjetId(id, res)) return;

  const appointment = await Appointment.findById(id).populate("services");
  if (!appointment) {
    return handleFoundErro("La cita no existe", res);
  }
  if (appointment.user.toString() !== req.user._id.toString()) {
    const error = new Error("Acceso no válido");
    return res.status(403).json({ msg: error.message });
  }

  const { date, time, totalAmount, services } = req.body;

  appointment.date = date;
  appointment.time = time;
  appointment.totalAmount = totalAmount;
  appointment.services = services;
  try {
    await appointment.save();
    const newDate = formatterDate(date);
    await sendEmailUpdateAppointment({ date: newDate, time });
    res.json({ msg: "Cita actualizada correctamente" });
  } catch {
    const error = new Error("Error al actualizar la cita");
    return res.status(400).json({ msg: error.message });
  }
};

const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  if (validateObjetId(id, res)) return;

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return handleFoundErro("La cita no existe", res);
    }
    if (appointment.user.toString() !== req.user._id.toString()) {
      const error = new Error("Acceso no válido");
      return res.status(403).json({ msg: error.message });
    }

    await appointment.deleteOne();

    const date = formatterDate(appointment.date)
    await sendEmailDeleteAppointment({
      date,
      time: appointment.time,
    });
    res.json({ msg: "Cita eliminada correctamente" });
  } catch {
    const error = new Error("Error al eliminar la cita");
    return res.status(400).json({ msg: error.message });
  }
};

export {
  createAppointment,
  getAppointmentByDate,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
