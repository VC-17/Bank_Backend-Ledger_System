import {accountModel} from "../models/account.model.js";

/*
The use of this controller is to create a new account for the authenticated user. It assumes that the user has already been authenticated and their information is available in the request object (req.user). The controller creates a new account associated with the authenticated user's ID and returns the created account in the response.
The user authentication is handled by the authMiddleware, which checks for a valid JWT token in the request cookies or authorization header. If the token is valid, it decodes the token to retrieve the user ID, fetches the corresponding user from the database, and attaches the user object to the request for further use. If the token is missing or invalid, it responds with a 401 Unauthorized status.
*/

async function createAccountController(req,res){
    const user = req.user; // Access the authenticated user from the request object
    const account = await accountModel.create({
        user: user._id, // Associate the account with the authenticated user's ID
    })

    res.status(201).json({
        account
    })
}

async function getUserAccountController(req,res){
    const accounts = await accountModel.find({user : req.user._id})
    res.status(200).json({
        accounts
    })
}

async function getUserAccountBalanceController(req,res){
    const {accountId} = req.params

    const account = await accountModel.findOne({
        _id : accountId ,
        user : req.user._id
    })

    if(!account){
        return res.status(401).json({
            message : "Account Not Found"
        })
    }

    const balance = await account.getBalance()
    
    res.status(200).json({
        accountId : account._id ,
        balance : balance
    })
}

export {createAccountController , getUserAccountController , getUserAccountBalanceController }