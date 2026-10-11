import mongoose from "mongoose";
import { ledgerModel } from "./ledger.model.js";

const accountSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User" ,
        required : [true , "Account must belong to a user"],
        index : true // index is created for this field to optimize queries that filter or sort by the user field. This can improve performance when searching for accounts associated with a specific user.
        //it increases the speed of data retrieval operations on the user field, especially when dealing with large datasets. However, it also adds some overhead during write operations (inserts, updates, deletes) because the index needs to be maintained.
        // it uses the data structure called B-tree to store the indexed values in a sorted manner. This allows for efficient searching, as the database can quickly traverse the tree to find the desired value or range of values.    
    },
    status : {
        type : String ,
        enum : {
            values : ["ACTIVE" , "FROZEN" , "CLOSED"] ,
            message : "Status can only be ACTIVE , FROZEN or CLOSED",
        },
        default : "ACTIVE"
    },
    currency : {
        type : String ,
        required : [true , "Currency is required"] ,
        default : "INR"
    }
},{timestamps:true})

accountSchema.index({user:1 , status:1}) // compound index is created on the user and status fields. This allows for efficient queries that filter or sort by both fields simultaneously. It can improve performance when searching for accounts associated with a specific user and having a particular status.

accountSchema.methods.getBalance = async function(){
    //balance is calculated as the difference of sums of all credited amount and all debited amount
    const balanceData = await ledgerModel.aggregate([
        {$match : {account : this._id}},
        {
            $group : {
                _id : null ,
                totalDebit : {
                    $sum : {
                        $cond : [
                            {$eq:["$type","DEBIT"]},
                            "$amount",
                            0 
                        ]
                    }
                },
                totalCredit : {
                    $sum : {
                        $cond : [
                            {$eq:["$type","CREDIT"]},
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {
            $project : {
                _id : 0,
                balance : {$subtract : ["$totalCredit","$totalDebit"]}
            }
        }
    ])

    //if the user is newly created then it wont have any ledger entry yet

    if(balanceData.length === 0){
        return 0
    }

    return balanceData[0].balance
}

export const accountModel = mongoose.model("Account" , accountSchema)