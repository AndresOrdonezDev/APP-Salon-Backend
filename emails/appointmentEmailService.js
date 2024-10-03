import { createTransport } from "../config/nodemailer.js";

export async function sendEmailNewAppointment({ date, time }) {
  const transporter = createTransport(
    process.env.HOST_EMAIL,
    process.env.PORT_EMAIL,
    process.env.USER_EMAIL,
    process.env.PASS_EMAIL
  );
  // send email when creating a new appointment
  await transporter.sendMail({
    from: "portafolio@ordonezandres.com", // sender address
    to: `contacto@ordonezandres.com`, // list of receivers
    subject: "AppSalon - Nueva Cita", // Subject line
    text: `AppSalon - Nueva cita`, // plain text body
    html: `<p>👋🏻 Hola admin, se ha asignado una nueva cita para el dia ${date} a las ${time} 😉!</p>`, // html body
  });
}

export async function sendEmailUpdateAppointment({ date, time }) {
    const transporter = createTransport(
        process.env.HOST_EMAIL,
        process.env.PORT_EMAIL,
        process.env.USER_EMAIL,
        process.env.PASS_EMAIL
      );
      // send email when creating a new appointment
      await transporter.sendMail({
        from: "portafolio@ordonezandres.com", // sender address
        to: `contacto@ordonezandres.com`, // list of receivers
        subject: "AppSalon - Actualización de Cita", // Subject line
        text: `AppSalon - Actualización de cita`, // plain text body
        html: `<p>👋🏻 Hola admin, un usuario ha modificado una cita🙂!</p>
                <p>La cita ahora quedo para el dia ${date} a las ${time} 😉!</p>`, // html body
      });
}
export async function sendEmailDeleteAppointment({ date, time }) {
    const transporter = createTransport(
        process.env.HOST_EMAIL,
        process.env.PORT_EMAIL,
        process.env.USER_EMAIL,
        process.env.PASS_EMAIL
      );
      // send email when creating a new appointment
      await transporter.sendMail({
        from: "portafolio@ordonezandres.com", // sender address
        to: `contacto@ordonezandres.com`, // list of receivers
        subject: "AppSalon - Cancelación de Cita", // Subject line
        text: `AppSalon - Cancelación de cita`, // plain text body
        html: `<p>👋🏻 Hola admin, un usuario ha cancelado una cita del día ${date} a las ${time}😶!</p>
                <p>Revisa tu agenda 😉!</p>`, // html body
      });
}
