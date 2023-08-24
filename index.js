let express=require("express")
const { connection } = require("./db")
let app=express()
app.use(express.json())
require("dotenv").config()
let jwt=require("jsonwebtoken")
let bcrypt=require("bcrypt")
let  cookieParser = require('cookie-parser')
app.use(cookieParser())
let cors=require("cors")
app.use(cors())

let {auth}=require("./middleware/auth")

let {userModel}=require("./model/usemodel")
let {blogModel}=require("./model/blogmodel")
const { Aggregate } = require("mongoose")

app.get("/",async(req,res)=>{
    try {
        res.status(200).send("hello")
       
        
    } catch (error) {
        res.status(200).send({msg:error.message})
    }
})


// register
app.post("/register",async(req,res)=>{
    
    try {
        let {email,password,username,avatar}=req.body
        let user=await userModel.findOne({email})
         if(user){
            res.status(401).send({msg:"user already registered"})
         }
         else{
             bcrypt.hash(password,5,async(err,hash)=>{
              if(hash){
                let newuser=new userModel({username,email,password:hash,avatar})
                await newuser.save()
                res.status(200).send({msg:"registration success full"})
              }
              else{
                res.status(402).send({msg:"internal error"})
              }
             })
           
         }

        
    } catch (error) {
        res.status(200).send({msg:error.message})
    }
})

//login 
app.post("/login",async(req,res)=>{
    try {
        let {email,password}=req.body
        let user=await userModel.findOne({email})
        if(user){
            bcrypt.compare(password,user.password,async(error,result)=>{
                if(result){
                    let accesstoken=jwt.sign({userid:user._id,username:user.username},process.env.access)
                     res.cookie("accesstoken",accesstoken)

                    res.status(200).send({msg:"login successfull",
                token:accesstoken,
                userid:user._id,
                username:user.username})
                }
                else{
                    res.status(401).send({msg:"wrong password"})
                }
            })
        }
        else{
            res.status(402).send({msg:"register first please"})
        }
        
    } catch (error) {
        res.status(200).send({msg:error.message})
    }
})


// get blog
app.get("/blogs",auth,async(req,res)=>{
    try {
        let data=await blogModel.aggregate([
            {
                $lookup:{
                    from:"users",
                    localField:"username",
                    foreignField:"_id",
                    as:"userdata"
                }


            }
        ])
        res.status(200).send(data)
    } catch (error) {
        res.status(200).send({msg:error.message})
    }
})

// searchby title

app.get("/blogs",async(req,res)=>{
    try {
        let {title}=req.query
        let data=await blogModel.find({title:{$regex:title,$options:"i"}})
        
        // Aggregate([
        //     {
        //         $lookup:{
        //             from:"users",
        //             localfield:"username",
        //             foreighField:"_id",
        //             as:"userdata"
        //         }

        //     }
        // ])
        res.status(200).send(data)
    } catch (error) {
        res.status(200).send({msg:error.message})
    }
})

// search by category

app.get("/blogs",async(req,res)=>{
    try {
        let {category}=req.query
        let data=await blogModel.find({category})
        res.status(200).send(data)   
    } catch (error) {
        res.status(200).send({msg:error.message})
    }
})

// sortby date
app.get("/blogs",async(req,res)=>{
    try {
        let {sort,order}=req.query
        if(order==desc){
            order=-1
        }
        else{
            order=1
        }
        let data=await blogModel.find({[sort]:order})
        res.status(200).send(data)
        res.status(200).send("hello")
       
        
    } catch (error) {
        res.status(200).send({msg:error.message})
    }
})

// post blog
app.post("/blogs",async(req,res)=>{
    try {
        let {username,title,content,category}=req.body

        let newblog=new blogModel({username,title,content,category})
        await newblog.save()
        res.status(200).send({msg:"new blog created"})
        
    } catch (error) {
        res.status(200).send({msg:error.message})
    }
})

// edit blog
app.patch("/blogs/:id",async(req,res)=>{
    try {
       let {id}=req.params 
        await blogModel.findByIdAndUpdate({_id:id},req.body)
        res.status(200).send({msg:"updated"})
    } catch (error) {
        res.status(200).send({msg:error.message})
    }
})

//delete blog
app.delete("/blogs/:id",async(req,res)=>{
    try {
        let {id}=req.params 
        await blogModel.findByIdAndDelete({_id:id})
        res.status(200).send({msg:"deleted"})
        
    } catch (error) {
        res.status(200).send({msg:error.message})
    }
})

app.post("/",async(req,res)=>{
    try {
        res.status(200).send("hello")
       
        
    } catch (error) {
        res.status(200).send({msg:error.message})
    }
})

// like
app.patch("/blogs/:id/like",async(req,res)=>{
    try {
        let {id}=req.params 
        let {username}=req.body
         let data=blogModel.find({_id:id})
         function checkuser(){
          data.forEach((ele) => {
            if(ele.username==username){
                return false
            }
            return true
          });
        }
        if(checkuser==false){
        await blogModel.findByIdAndUpdate({_id:id},{likes:like+1})
        res.status(200).send({msg:"updated"})
        }
        else{
            res.status(200).send({msg:"already liked"}) 
        }
       
        
    } catch (error) {
        res.status(200).send({msg:error.message})
    }
})

















app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("server running")
    } catch (error) {
       console.log(error) 
    }
})