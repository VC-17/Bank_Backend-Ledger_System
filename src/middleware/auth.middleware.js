import { userModel } from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import { tokenBlacklistModel } from "../models/blackList.model.js";

/*
This middleware function checks for the presence of a JWT token in the request cookies or authorization header.
If a valid token is found, it decodes the token to retrieve the user ID, fetches the corresponding user 
from the database, and attaches the user object to the request for further use. If the token is missing 
or invalid, it responds with a 401 Unauthorized status.

*/
async function authMiddleware(req,res,next){
    const token = req.cookies.token ||  req.headers.authorization?.split(" ")[1] // Bearer token
    if(!token){
        return res.status(401).json({
            message : "Unauthorized ! , Token is missing",
            status : "Failed"
        })
    }
    const isBlacklisted = await tokenBlacklistModel.findOne({token})
    if(isBlacklisted){
        return res.status(400).json({
            message : "Unauthorized , token is invalid"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId); 
        req.user = user; // Attach the user object to the request for further use
        return next();
    } catch (error) {
        return res.status(401).json({
            message : "Unauthorized ! , Invalid Token",
            status : "Failed"
        })
    }
}


/*
This middleware function is similar to the authMiddleware but adds an additional check to ensure that the user is a system user.
If the user is not a system user, it responds with a 403 Forbidden status. Otherwise, it attaches the user object to the request for further use.
SystemUser is a user who has the ability to create initial funds transactions to regular users. This is typically 
used for administrative or privileged operations within the application.
*/
async function authSystemUserMiddleware(req,res,next){
    const token = req.cookies.token ||  req.headers.authorization?.split(" ")[1] // Bearer token
    if(!token){
        return res.status(401).json({
            message : "Unauthorized ! , Token is missing",
            status : "Failed"
        })
    }
    const isBlacklisted = await tokenBlacklistModel.findOne({token})
    if(isBlacklisted){
        return res.status(400).json({
            message : "Unauthorized , token is invalid"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId).select("+systemUser"); 
        if(!user.systemUser){
            return res.status(403).json({
                message : "Forbidden access, not a system user",
                status : "Failed"
            })
        }
        req.user = user; // Attach the user object to the request for further use
        return next();
    } catch (error) {
        return res.status(401).json({
            message : "Unauthorized ! , Invalid Token",
            status : "Failed"
        })
    }
}

export {authMiddleware , authSystemUserMiddleware}