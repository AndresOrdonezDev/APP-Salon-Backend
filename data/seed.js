import dotenv from 'dotenv'
import colors from 'colors'
import {db} from '../config/db.js'
import Services from '../models/Services.js'
import {services} from '../data/beautyServices.js'
dotenv.config()
await db()

async function seedDB(){
    try {
        
        await Services.insertMany(services)
        console.log(colors.bgGreen('Subida finalizada exitosamente'))
        process.exit(0)
    } catch (error) {
        console.log.apply(error)
        process.exit(1)
    }
}

async function clearDB(){
    try {
        await Services.deleteMany()
        console.log(colors.bgYellow('el vaciado de la base de datos se realizó exitosamente'))
        process.exit(0)
    } catch (error) {
        console.log.apply(error)
        process.exit(1)
    }
}

if(process.argv[2] === '--import'){
    seedDB()
}else{
    clearDB()
}