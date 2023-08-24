let jwt=require("jsonwebtoken")
require("dotenv").config()

let auth=async(req,res,next)=>{
    let accesstoken=req.headers.authorization
    console.log(accesstoken,"access")
   try {
    // let {accesstoken}=req.cookies

    let decoded=jwt.verify(accesstoken,process.env.access)
    console.log(decoded.username)
    console.log(decoded.userid,"id")
    if(decoded){
       req.userid=decoded.userid
       req.username=decoded.username
        next()
    }
    else{
        res.status(200).send({msg:"it is protected route"})
    }
    
   } catch (error) {
    res.status(200).send({msg:error.message})
   }
    

}

module.exports={auth}