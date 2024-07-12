import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import path from "path"
import ConnectDB from './config/db.js'
import userRouter from "./routes/userRoute.js"
import {v2 as cloudinary} from "cloudinary"
const app=express()
const __dirname=path.resolve()
dotenv.config()
ConnectDB()
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SECRET_KEY
})
const corsOption={
    credentials:true,origin:["http://localhost:5173"]
}
app.use(express.json({limit:'10mb'}))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors(corsOption))
app.use("/api/users",userRouter)
app.use(express.static(path.join(__dirname,'/client/dist')))
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'client','dist','index.html'))
})
const server=app.listen(8000,()=>{
    console.log(`Server Started at http://localhost:${server.address().port}`)
})

app.use((err,req,res,next)=>{
    const statusCode =err.statusCode || 500
    const message=err.message || "Internal Server Error"
    res.status(statusCode).send({success:false,statusCode,message})
    next()
})