import Services from "../models/Services.js";
import {validateObjetId, handleFoundErro} from '../utils/index.js'


const createService = async (req, res) => {
  if (Object.values(req.body).includes("")) {
    const error = new Error("Todos los campos son obligatorios");
    return res.status(400).json({
      msg: error.message,
    });
  }

  try {
    const service = new Services(req.body);
    await service.save();
    res.json({
      msg: "Registro creado exitosamente",
    });
  } catch (error) {
    console.log(error);
  }
};

const getServices = async (req, res) => {
  try {
    const services = await Services.find()
    res.json(services)
  } catch (error) {
    console.log(error)
  }
};

const getServiceById = async (req, res) => {
  const { id } = req.params;
  if(validateObjetId(id,res))return
  
  //validate that it exists
  const service = await Services.findById(id);
  if (!service) {
    return handleFoundErro('Servicio no encontrado',res)
  }

  //show result
  res.json(service);
};


const updateService = async(req, res)=>{
  const { id } = req.params;
  if(validateObjetId(id,res))return
  
  //validate that it exists
  const service = await Services.findById(id);
  if (!service) {
    return handleFoundErro('Servicio no encontrado',res)
  }

  service.name = req.body.name || service.name
  service.price = req.body.price || service.name

  try {
    await service.save()
    res.json({
      msg: 'Registro actualizado exitosamente'
    })
  } catch (error) {
    console.log(error)
  }

}

const deleteService = async (req, res)=>{
  const {id} = req.params
  if(validateObjetId(id,res))return

  const service = await Services.findById(id)
  if (!service) {
    return handleFoundErro('Servicio no encontrado',res)
  }

  try {
    await service.deleteOne()
    res.json({
      msg: 'Registro eliminado correctamente'
    })
  } catch (error) {
    console.log(error)
  }
  
}

export { getServices, createService, getServiceById, updateService, deleteService };
