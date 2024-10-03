import express from "express" //ESM
import dotenv from 'dotenv'
import colors from 'colors'
import cors from 'cors'
import {db} from './config/db.js'
import servicesRoute from './routes/servicesRoute.js'
import authRoute from './routes/authRoute.js'
import appointmentsRoute from './routes/appointmentsRoute.js'
import userRoute from './routes/userRoute.js'


dotenv.config()

//config app
const app = express()

//read data through request body  
app.use(express.json())

//connect to db
db()

//config cors
const whiteList = [process.env.FRONTEND_URL, undefined]
//const whiteList = [process.env.FRONTEND_URL, undefined]

const corsOptions ={
    origin:function(origin,callback){
      if(whiteList.includes(origin)){
        //allow connection
        callback(null, true)
      }else{
        //Don't allow connection
        callback(new Error('Error CORS: the direcction is not on whiteList'))
      }
    }
}

app.use(cors(corsOptions))

//define route
app.use('/api/services',servicesRoute)
app.use('/api/auth',authRoute)
app.use('/api/appointments',appointmentsRoute)
app.use('/api/user',userRoute)

//define port
const PORT = process.env.PORT || 4000

//start app
app.listen(PORT,()=>{
    console.log(colors.blue('server running on port',PORT))
})