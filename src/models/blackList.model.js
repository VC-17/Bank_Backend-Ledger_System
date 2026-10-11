// blacklisting of tokens for logout

import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema({
    token : {
        type : String ,
        required : [true , "Token is required to blacklist"],
        unique : [true , "Token is already blacklisted"]
     }
    // blacklistedAt : {
    //     type : Date ,
    //     default : Date.now,
    //     immutable : true
    // }
},{timestamps : true})

tokenBlacklistSchema.index({createdAt : 1},{
    expireAfterSeconds : 60 * 60 * 24 * 3 // 3 days
})

export const tokenBlacklistModel = mongoose.model("tokenBlacklist",tokenBlacklistSchema)

