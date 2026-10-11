
import { userModel } from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import sendRegistrationEmail from "../services/email.service.js";
import { tokenBlacklistModel } from "../models/blackList.model.js";

async function userRegisterController(req,res){
    const {email , password , name} = req.body
    const isExists = await userModel.findOne({
        email : email
    })
    if(isExists){
        return res.status(402).json({
            message : "Userexists with this email",
            status : "Failed"
        })
    }
    const user = await userModel.create({
        email , password , name
    })

    const token = jwt.sign({userId : user._id}, process.env.JWT_SECRET , {expiresIn : "3d"})
    res.cookie("token",token)
    res.status(201).json({
        user : {
            id : user._id ,
            email : user.email ,
            name : user.name
        },
        token
    })

    await sendRegistrationEmail(user.email, user.name);
}

async function userLoginController(req,res){
    const {email , password} = req.body
    const user = await userModel.findOne({email}).select("+password")
    if(!user){
        return res.status(401).json({
            message : "Email does not exists",
            status : "Failed"

        })
    }
    const isValidPassword = await user.comparePassword(password)
    if(!isValidPassword){
        return res.status(401).json({
            message : "Invalid Password",
            status : "Failed"
        })
    }
    const token = jwt.sign({userId : user._id}, process.env.JWT_SECRET , {expiresIn : "3d"})
    res.cookie("token",token)
    res.status(200).json({
        user : {
            id : user._id ,
            email : user.email ,
            name : user.name
        },
        token
    })
}

async function userLogoutController(req,res){
    const token = req.cookies.token ||  req.headers.authorization?.split(" ")[1] // Bearer token
    if(!token){
        return res.status(401).json({
            message : "User logged out successfully"
        })
    }
    res.cookie("token")

    await tokenBlacklistModel.create({
        token : token
    })

    res.status(200).json({
        message : "User logged out successfully",
        success : true
    })
}

export {userRegisterController , userLoginController , userLogoutController}