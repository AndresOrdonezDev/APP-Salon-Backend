import mongoose from 'mongoose'
import colors from 'colors'

export const db = async ()=>{
    try {
        const db = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Mongo is connected on`, colors.bgMagenta(` ${db.connection.host}`),  `on port`, colors.bgMagenta(`${db.connection.port}`))
    } catch (error) {
        console.log(colors.bgRed(error.message))
        process.exit(1)
    }
}