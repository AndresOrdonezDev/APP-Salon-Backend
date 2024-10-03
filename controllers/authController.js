import User from "../models/User.js";
import {
  sendEmailVerification,
  sendEmailForgotPassword,
} from "../emails/authEmailService.js";
import { generateJWT, uniqueId } from "../utils/index.js";

const register = async (req, res) => {
  //validate all fields
  if (Object.values(req.body).includes("")) {
    const error = new Error("Todos los campos son obligatorios");
    return res.status(400).json({ msg: error.message });
  }

  const { name, password, email } = req.body;
  //Avoid duplicate records
  const userExists = await User.findOne({ email });

  if (userExists) {
    const error = new Error("Ya hay un usuario registrado con ese correo");
    return res.status(400).json({ msg: error.message });
  }

  //validate password extension
  const MIN_PASSWORD_LENGTH = 8;

  if (password.trim().length < MIN_PASSWORD_LENGTH) {
    const error = new Error(
      `La contraseña debe tener mínimo ${MIN_PASSWORD_LENGTH} caracteres`
    );
    return res.status(400).json({ msg: error.message });
  }

  //create user
  try {
    const user = new User(req.body);

    await user.save();
    const result = await user.save();

    const { name, email, token } = result;

    sendEmailVerification({ name, email, token });

    res.json({ msg: "Usuario creado correctamente, revisa tu email" });
  } catch (error) {
    console.log(error);
  }
};

const verifyAccount = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ token });

  //validate if token exists
  if (!user) {
    const error = new Error("Hubo un error, token no válido");
    return res.status(401).json({ msg: error.message });
  }

  //change verified user to true
  try {
    user.verified = true;
    user.token = "";
    await user.save();
    res.json({ msg: "Usuario confirmado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  //Confirm user existence
  if (!user) {
    const error = new Error("Email no encontrado");
    return res.status(403).json({ msg: error.message });
  }

  //verify confirmed token
  if (!user.verified) {
    const error = new Error("Aún no has confirmado tu cuenta vía email");
    return res.status(403).json({ msg: error.message });
  }

  //verify credentials
  if (await user.checkPassword(password)) {
    const token = generateJWT(user._id);
    return res.json({ msg: "Bienvenido", token });
  } else {
    const error = new Error("La contraseña es incorrecta");
    return res.status(403).json({ msg: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error(`No se encontró el usuario ${email}`);
    return res.status(404).json({ msg: error.message });
  }

  try {
    const token = uniqueId();
    user.token = token;
    await user.save();
    sendEmailForgotPassword({ name: user.name, email: user.email, token });
    res.json({ msg: "Se ha enviado la solicitud a tu email" });
  } catch (error) {
    console.log(error);
  }
};

const verifyTokenResetPassword = async (req, res) => {
  const { token } = req.params;
  try {
    const isToken = await User.findOne({ token });
    if (!isToken) {
      const error = new Error(`Token no válido`);
      return res.status(400).json({ msg: error.message });
    }
    res.json({msg:"Token validado"});
  } catch (error) {
    res.json({ msg: "Ocurrió un error al validar el token" });
  }
};

const updatePassword = async (req, res)=>{
  const {token} = req.params
  const {password} = req.body
  try {
    const user = await User.findOne({ token });
    if (!user) {
      const error = new Error(`Token no válido`);
      return res.status(400).json({ msg: error.message });
    }

    user.password = password
    user.token = ""
    await user.save()
    res.json({msg:"La contraseña se actualizado correctamente"})
  } catch (error) {
    res.json({ msg: "Ocurrió un error al validar el token" });
  }
}

const getUser = async (req, res) => {
  const { user } = req;
  res.json(user);
};

const admin = async(req, res)=>{
  const {user} = req
  if(!user.admin){
    const error = new Error("Acceso no válido")
    return res.status(403).json({msg:error.message})
  }
  
  res.json(user)
}

export {
  register,
  verifyAccount,
  login,
  getUser,
  forgotPassword,
  verifyTokenResetPassword,
  updatePassword,
  admin
};
