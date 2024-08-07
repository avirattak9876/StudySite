import { User } from "../models/userModels.js";
import mailsender from "../utils/mailSender.js";
import bcrypt from "bcrypt";
import crypto from "crypto";


  export const resetPasswordToken = async(req,res)=>{

      try{
        const {email} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                success:false,
                message:"Email doesn't exist"
            })
        }

        const token = crypto.randomUUID();

        const updatedDetails = await User.findOneAndUpdate(
            {email},
            {token:token ,resetPasswordExpires: Date.now() + 5*60*1000},{new:true});

         const url = `http://localhost:3000/update-password/${token}`;

         await mailsender(email, "Password Reset Link", `Password reset link: ${url}`);

         return res.status(200).json({
            success:true,
            message:'Reset link sent',
            updatedDetails
        })
      }

      catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while sending reset password mail'
        })

      }
             
  }

  export const resetPassword = async (req,res) => {

    try {
        const {token, password, confirmPassword} = req.body;     

        if(!token||!password||!confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Enter all details"
            })
        }

        const existingUser = await User.findOne({token:token});
        if(!existingUser) {
            return res.json({
                success:false,
                message:'Token is invalid',
            });
        }

        if(existingUser.resetPasswordExpires<Date.now()){
            return res.status(500).json({
                success:false,
                message:"Token is no longer valid"
            })
        }

        if (password!==confirmPassword) {
            return res.status(500).json({
                success:false,
                message:"Password Don't match"
            })
        }

        const hashedPwd = await bcrypt.hash(password, 10);
        const updatedUser = await User.findOneAndUpdate({token},{
            password:hashedPwd
        },{new:true})
        console.log("Updated user after password change is", updatedUser)
        return res.status(200).json({
            success:true,
            message:"Password Changed successfully",
            updatedUser
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while reseting password'
        })
    }
}