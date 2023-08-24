let mongoose=require("mongoose")

let userSchema=mongoose.Schema({
    username:{
        type:String,
        unique:true
    },
    email:String,
    password:String,
    avatar:String
})

userModel=mongoose.model("user",userSchema)

module.exports={userModel}