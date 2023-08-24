let mongoose=require("mongoose")

let blogSchema=mongoose.Schema({
   username:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
   },
   title:String,
   content:String,
   category:String,
   date:{
    type:Date,
    default:new Date()
   },
   likes:{
    type:Number,
    default:0
   },
   comments:{
    type:[{
    username:String,
    content:String,
    }],
    default:[]
   }

})

blogModel=mongoose.model("blog",blogSchema)

module.exports={blogModel}