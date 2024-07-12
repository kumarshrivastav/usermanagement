import express from 'express'
import {check} from "express-validator"
import userController from '../controllers/userController.js'
import verifyToken from '../middleware/verifyToken.js'
import multer from 'multer'
const router=express.Router()
const signUpValidation=[
    check("firstName","firstName is required").isString(),
    check("lastName","lastName is required").isString(),
    check("email","email is required").isEmail(),
    check("password","password is required with minimum 8 characters").isLength({min:8})
]

const signInValidation=[
    check("email","email is required").isEmail(),
    check("password","password is required with minimum 8 characters").isLength({min:8})
]
const storage=multer.memoryStorage()
const upload=multer({storage,limits:{fileSize:5*1024*1024}})
router.post("/signup",signUpValidation,userController.SignUp)
router.post("/signin",signInValidation,userController.SignIn)
router.get("/logout",userController.Logout)
router.put("/update",userController.Update)
router.get("/getusers",userController.GetUsers)
router.put("/updateuser/:userId",verifyToken,upload.array('avatar',1),userController.UpdateUser)
router.delete("/deleteuser/:userId",verifyToken,userController.DeleteUser)
router.put("/updateuserbyadmin/:userId",verifyToken,userController.UpdateUserByAdmin)
router.get("/getuser/:userId",verifyToken,userController.GetUser)
router.post("/adduserbyadmin",verifyToken,upload.array('avatar',1),userController.AddUserByAdmin)
export default router