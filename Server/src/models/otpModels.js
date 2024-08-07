import mongoose from "mongoose";
import mailsender from "../utils/mailSender.js";
import { otpTemplate } from "../mail/templates/emailVerificationTemplate.js";

const optSchema = new mongoose.Schema({
    
     email:{
        type:String,
        required:true,
     },
     otp:{
        type:String, 
        required:true,
     },
     createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60*1000,
      },

});


 async function sendverificationEmail(email,otp){
       
   try {
      const mailResponse = await mailsender(email,
       "Verification Email",
       otpTemplate(otp))
      console.log("Email sent Successfully: ", mailResponse.response);
  } catch (error) {
      console.log("error occured while sending mails: ", error);
      throw error;
  }
 }

 optSchema.pre("save",async function(next){
      
      await sendverificationEmail(this.email,this.otp);
      next();
 })

export const OTP = mongoose.model("OTP",optSchema);