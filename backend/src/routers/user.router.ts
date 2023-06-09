import { Router } from "express";
import { sample_users } from "../data";
import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler";
import { UserModel } from "../models/user.model";


const router = Router()

router.get("/seed", asyncHandler(
    async(req,res)=>{
    const usersCount = await UserModel.countDocuments()
    if(usersCount>0){
        res.send("Seed is already done!")
        return
    }
    await UserModel.create(sample_users)
    res.send("Seed is Done")
}))

router.post("/login", asyncHandler(
    async (req, res)=>{
        const {email,password} = req.body
        const user = await UserModel.findOne({email,password})
    
        if(user){
            res.send(generateTokenResponse(user))
        }else{
            res.status(400).send("Email or password not valid")
        }
    }
))

const generateTokenResponse = (user:any)=>{
    const token = jwt.sign({
        email:user.email, isAdmin:user.isAdmin
    },"PrivateKey",{
        expiresIn:"30d"
    })

    user.token = token
    return user
}

export default router