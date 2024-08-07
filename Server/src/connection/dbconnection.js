 
 import mongoose from "mongoose";


 const connectDB = async(req,res)=>{
      
     mongoose.connect(process.env.DB_URL,{}).then(()=>{
        console.log("DB connected successfully")
     }).catch((err)=>{
        console.log("DB cant be connected",err);
        process.exit(1);
     })
 }

 export default connectDB;