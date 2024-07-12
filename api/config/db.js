import mongoose from "mongoose";
const ConnectDB=async ()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGODB_CONNECTION_STRING_COMPASS,{bufferCommands:true})
        console.log(`MongoDB Connected at ${conn.connection.host}`)
    } catch (error) {
        console.log(`Errro in Connecting to DB:${error}`)
    }
}

export default ConnectDB;