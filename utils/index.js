import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import {format} from 'date-fns'
import {es} from 'date-fns/locale' // convert date to Spanish


const validateObjetId = (id, res) => {
  //validate the object id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("El id no es válido");
    return res.status(400).json({
      msg: error.message,
    });
  }
};

const handleFoundErro = (msgError, res)=>{
    //validate that it exists
    const error = new Error(msgError);
    return res.status(404).json({
      msg: error.message,
      
    });
}

//create a unique ID for each user who logs in
const uniqueId = ()=> Date.now().toString(32) + Math.random().toString(32).substring(2)


//generate a jsonWebToken
const generateJWT = (id)=>{
  const token = jwt.sign({id},process.env.JWT_SECRET,{
    expiresIn:'30d'
  })

  return token
}

const formatterDate = (date)=>{
  return format(date,'PPPP',{locale:es})
}


export {
    validateObjetId,
    handleFoundErro,
    uniqueId,
    generateJWT,
    formatterDate,
}