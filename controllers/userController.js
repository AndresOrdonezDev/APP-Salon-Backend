import Appointment from "../models/Appointment.js";

const getUserAppointments = async (req, res) => {
  const { user } = req.params;
    
  if (user !== req.user._id.toString()) {
    const error = new Error("Acceso denegado");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const query = req.user.admin
      ? { date: { $gte: new Date() } }
      : { user, date: { $gte: new Date() } };

    const appointments = await Appointment.find(query)
      .populate("services")
      .populate({path:'user',select:'name email'})
      .sort({ date: "asc" }); //Even though the service model is in uppercase, it must be written in lowercase
    res.json(appointments);
  } catch {
    const error = new Error("Error al consultar las citas del usuario");
    res.status(400).json({ msg: error.message });
  }
};

export { getUserAppointments };
