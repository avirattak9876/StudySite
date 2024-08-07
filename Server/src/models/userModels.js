import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
      
     firstName:{
        type:String,
        required:true,
        trim:true
     },
     lastName:{
        type:String,
        required:true,
        trim:true
     },
     email:{
        type:String,
        required:true,
        trim:true
     },
     password:{
        type:String,
        required:true,
     },
     accountType:{
        type:String,
        enum:["Student","Instructor","Admin"],
        required:true,
     },
     token:{
      type:String,
     },
     resetPasswordExpires:{
        type:Date,
     },
     additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile",
        required:true,
     },
     courses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        }
     ],
     image:{
        type:String,
        required:true
     },
     courseProgress:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"CourseProgress",
     }]
});

export const User = mongoose.model("User",userSchema);