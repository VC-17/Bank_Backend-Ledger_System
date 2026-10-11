/*
This is the ledger model which is used to store the ledger entries for each transaction.
The ledger entries are immutable and cannot be modified or deleted once created. 
This is to ensure the integrity of the ledger and prevent any tampering with the transaction history.
*/ 



import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema({
    account : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Account",
        required : [true,"Ledger must be associated with an account"],
        index : true ,
        immutable : true // value cant be changed in a ledger once registered in the ledger
    },
    amount : {
        type : Number ,
        required : [true,"Amount is required for creating a ledger entry"],
        immutable : true
    },
    transaction : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "transaction",
        required : [true , "Ledger must be associated with a transaction"],
        immutable : true ,
        index : true 
    },
    type : {
        type : String ,
        enum : {
            values : ["CREDIT","DEBIT"],
            messages : "Type can be either debit or credit"
        },
        required : [true,"Ledger type is required"],
        immutable : true
    }

},{timestamps:true})

function preventLedgerModification(){
    throw new Error("Ledger entries are immutable and cannot be modified or deleted")
}

ledgerSchema.pre("findOneAndUpdate",preventLedgerModification)
ledgerSchema.pre("updateOne",preventLedgerModification)
ledgerSchema.pre("deleteOne",preventLedgerModification)
ledgerSchema.pre("findOneAndDelete",preventLedgerModification)
ledgerSchema.pre("remove",preventLedgerModification)
ledgerSchema.pre("deleteMany",preventLedgerModification)
ledgerSchema.pre("updateMany",preventLedgerModification)
ledgerSchema.pre("findOneAndReplace",preventLedgerModification)

export const ledgerModel = mongoose.model("ledger",ledgerSchema)