import mongoose from "mongoose";

function connectToDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Server Connected to DB")
    })
    .catch(err=>{
        console.log("Error connecting to DB")
        process.exit(1) // if db is not connected then close the server here only
    })
}

export {connectToDB}