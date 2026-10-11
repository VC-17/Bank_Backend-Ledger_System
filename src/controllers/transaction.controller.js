import {transactionModel} from "../models/transaction.model.js"
import {ledgerModel} from "../models/ledger.model.js"
import { sendTransactionEmail } from "../services/email.service.js"
import { sendTransactionFailureEmail } from "../services/email.service.js"
import { accountModel } from "../models/account.model.js"
import mongoose from "mongoose"


async function createTransaction(req,res){

    //validate request

    const {fromAccount , toAccount , amount , idempotencyKey} = req.body
    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message : "fromAccount , toAccount , amount and idempotencyKey are required",
            status : 'Failed'
        })
    }
    const fromUserAccount = await accountModel.findOne({
        _id : fromAccount
    })
    const toUserAccount = await accountModel.findOne({
        _id : toAccount
    })
    if(!fromUserAccount || !toUserAccount){
        return res.status(401).json({
            message : "invalid fromAccount or toAccount",
            status : "Failed"
        })
    }

    // validate idempotency key

    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey : idempotencyKey
    })
    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status==="COMPLETED"){
            return res.status(200).json({
                message : "Transaction already completed",
                transaction : isTransactionAlreadyExists
            })
        }
        else if(isTransactionAlreadyExists.status==="PENDING"){
            return res.status(200).json({
                message : "Transaction is still processing"
            })
        }
        else if(isTransactionAlreadyExists.status==="FAILED"){
            return res.status(501).json({
                message : "Transaction Failed , Please Try Again"
            })
        }
        else if(isTransactionAlreadyExists.status==="REVERSED"){
            return res.status(501).json({
                message : "Transaction Reversed , Please Try Again"
            })
        }
    }

    //check account status

    if(!fromAccount.status==="ACTIVE" || !toAccount.status==="ACTIVE"){
        return res.status(400).json({
            message : "Both fromAccount and toAccount must be active"
        })
    }
    
    //derive sender balance from ledger 
    //we'll be using aggregation pipelines for this

    const balance = await fromUserAccount.getBalance()

    if(balance < amount){
        return res.status(400).json({
            message : `insufficient Balance . Current Balance : ${balance} , requested amount : ${amount}`
        })
    }

    let transaction;

    try {
        // create transaction (PENDING)
    
        const session = await mongoose.startSession()
        session.startTransaction() //startTransaction() is a method provided by the MongoDB driver that 
        // initiates a new transaction  within the current session. It marks the beginning of a series 
        // of operations that should be treated  as a single unit of work.
        // MongoDb provides transactions to ensure atomicity and consistency of
        // operations. This means that either all the operations within the transaction are executed 
        // successfully, or none of them are applied, maintaining data integrity.
         
        transaction = (await transactionModel.create([{
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status : "PENDING"
        }],{session}) )[0]
    
        //created debit ledger entry 
    
        const debitLedgerEntry = await ledgerModel.create([{
            account : fromAccount,
            amount : amount ,
            transaction : transaction._id ,
            type : "DEBIT"
        }],{session}) // session tells that these all are a part of steps of the session created above
        // and all these should be completed all or none
    
    
    
        // this is used to hold the transaction for 100 seconds i.e the amount will be deducted from the
        //senders account but wont be credited into the receivers account for 100 seconds
        await (()=>{
            return new Promise((resolve)=>setTimeout(resolve , 100*1000))
        })()
    
    
        //create credit ledger entry
    
        const creditLedgerEntry = await ledgerModel.create([{
            account : toAccount,
            amount : amount ,
            transaction : transaction._id ,
            type : "CREDIT"
        }],{session})
    
        await transactionModel.findOneAndUpdate(
            {_id : transaction._id},
            {status : "COMPLETED"},
            {session}
        )
    
        // //mark transaction completed
    
        // transaction.status = "COMPLETED"
        // await transaction.save({session})
    
        //commit mongoDB session
    
        await session.commitTransaction()
        session.endSession()
    } catch (error) {
        return res.status(400).json({
            message : "Transaction is pending due to some issue , please retry later"
        })
    }

    //send email notification

    await sendTransactionEmail(req.user.email , req.user.name , amount , toAccount)

    return res.status(201).json({
        success : true,
        message : "Transaction completed successfully",
        transaction : transaction
    })

}

/* 
This controller function is responsible for creating an initial funds transaction from a system user account 
to a regular user account. It validates the request body to ensure that the required fields 
(toAccount, amount, and idempotencyKey) are present. It then checks if the specified toAccount exists 
in the database. If the toAccount is valid, it retrieves the system user account associated with the 
authenticated user. If the system user account is found, it proceeds to create a transaction from the 
system user account to the specified toAccount with the given amount and idempotencyKey. If any 
validation fails, it responds with appropriate error messages and status codes.
*/
async function createInitialFundsTransaction(req,res){
    const {toAccount , amount , idempotencyKey} = req.body
    if(!toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message : "toAccount , amount and idempotencyKey are required",
            status : 'Failed'
        })
    }
    const toUserAccount = await accountModel.findOne({
        _id : toAccount
    })
    if(!toUserAccount){
        return res.status(401).json({
            message : "invalid fromAccount toAccount",
            status : "Failed"
        })
    }
    //systemUser will be the fromAccount
    const fromUserAccount = await accountModel.findOne({
        systemUser : true ,
        user : req.user._id
    })
    if(!fromUserAccount){
        return res.status(401).json({
            message : "System user account not found"
        })
    }
    const session = await mongoose.startSession()
    session.startTransaction()
    
    const transaction = new transactionModel({
        fromAccount : fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status : "PENDING"
    })

    const debitLedgerEntry = await ledgerModel.create([{
        account : fromUserAccount._id,
        amount : amount ,
        transaction : transaction._id ,
        type : "DEBIT"
    }],{session})

    const creditLedgerEntry = await ledgerModel.create([{
        account : toAccount,
        amount : amount ,
        transaction : transaction._id ,
        type : "CREDIT"
    }],{session})

    transaction.status = "COMPLETED"
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
        message : "Initial Funds Transaction Completed Successfully",
        transaction : transaction
    })
}

export {
    createTransaction ,
    createInitialFundsTransaction
}
