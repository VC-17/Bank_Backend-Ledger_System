import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    email: {
    type: String,
    required: [true, "Email is required"],
    unique : [true,"Email already exists"] ,
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid Email address"] //regex to satisfy email adress requirements
   },
   name : {
    type : String ,
    required : [true , "Name is required"]
   },
   password : {
    type : String ,
    required : [true , "Password is required"],
    minlength : [6 , "Password should contain atleast 6 characters"],
    select : false // whenever we fetch user data from frontend then the password wont be fetched until mentioned
   },
   systemUser : {
    type : Boolean,
    default : false,
    immutable : false ,
    select : false
   }
},{timestamps:true})


userSchema.pre("save",async function(){
    if(!this.isModified("password")){
        return 
    }
    const hash = await bcrypt.hash(this.password ,10)
    this.password = hash

    return 
})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password)
}


export const userModel = mongoose.model("User",userSchema)