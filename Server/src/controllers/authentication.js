 import { User } from "../models/userModels.js"
 import { OTP } from "../models/otpModels.js"
 import { Profile } from "../models/profileModels.js"
 import otpGenerator from "otp-generator"
 import  jwt  from "jsonwebtoken"
 import bcrypt from "bcrypt"
import mailsender from "../utils/mailSender.js"
import { passwordUpdate } from "../mail/templates/passwordUpdate.js"
   
// OTP CREATION
   export const createOTP = async (req,res)=>{
         
    try{
          
        const {email} = req.body;
        console.log(email);

        const checkUser = await User.findOne({email});

        if(checkUser){
            return res.status(401).json({
                success:false,
                message:"User already Registered"
            })
        }

        let otp;
        let otpExists;
    
        do {
          otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
          });
    
          otpExists = await OTP.findOne({ otp : otp });
    
        } while (otpExists);
        

        const otpData = {email,otp};

        const otpBody = await OTP.create(otpData);

        res.status(200).json({
            success:true,
            message:"OTP sent Successfully",
           
        })

    }
    catch(err){
           console.log(err);
           res.status(500).json({
            success: false,
            message: "An error occurred",
            error: err.message,
          });
    }
    
   }

//SIGN UP ALONG WITH OTP
   export const signUP = async(req,res)=>{

      try{       
      const{firstName,lastName,email,password,confirmPassword,accountType,contactNumber,otp} = req.body;

      if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
           return res.status(403).json({
            success:false,
            message:"All fields required"
           })
      }

      if(password !== confirmPassword){
        return res.status(400).json({
            success:false,
            message:"password and confirmPassword are different"
           })
      }

      const checkUser = await User.findOne({email});

        if(checkUser){
            return res.status(400).json({
                success:false,
                message:"User already Registered"
            })
        }


        const recentOTP = await OTP.find({email}).sort({createdAt : -1}).limit(1);

        if(recentOTP.length == 0){
            return res.status(400).json({
                success:false,
                message:"OTP NOT FOUND"
            })
        }
        else if(otp !== recentOTP[0].otp){
            return res.status(400).json({
                success:false,
                message:"OTP not Valid"
            })
        }


        const hashPassword = await bcrypt.hash(password,10)
        
        const profileDetails = await Profile.create({
            gender:null,
            dateofBirth:null,
            about:null,
            contactNumber:null,
        })

        const user = await User.create({
             firstName,
             lastName,
             email,
             contactNumber,
             password:hashPassword,
             accountType,
             additionalDetails:profileDetails._id,
             image:`https://api.dicebear.com/9.x/initials/svg?seed=${firstName} ${lastName}`
        })

        res.status(200).json({
            success:true,
            message:"User is registered Successfully",
            user
        })

      }

      catch(err){
        console.log(err);
        res.status(500).json({
         success: false,
         message: "An error occurred",
         error: err.message,
       });
      }

   }

// LOGIN AND TOKEN GENERATE 
export const login = async(req,res)=>{

     try{
        const {email,password} = req.body;

        if(!email || !password){
          return res.status(403).json({
              success:false,
              message:"All fields required"
             })
        }
  
        const user = await User.findOne({email})
  
        if(!user){
          return res.status(403).json({
              success:false,
              message:"User is not registered"
             })
        }
  
        const ans = await bcrypt.compare(password,user.password);
  
        if(!ans){
          return res.status(400).json({
              success:false,
              message:"Wrong password"
             })
        }
      
        const payload = {
          email:user.email,
          id:user._id,
          accountType:user.accountType,
        }
        
  
        const token = jwt.sign(payload,process.env.JWT_SECRET,{
          expiresIn:"4h"
        })
  
        user.toObject();
        user.token = token;
        user.password=undefined;
  
        const options = {
          expires: new Date(Date.now() + 3*24*60*60*1000),
          httpOnly:true,
        }
  
  
        res.cookie("token",token,options).status(200).json({
              success:true,
              user,
              token,
              message:"Login Successfull"
        })
  
     }

     catch(err){
        console.log(err);
        res.status(500).json({
         success: false,
         message: "An error occurred",
         error: err.message,
       });
     }
       
}


// CHANGE PASSWORD
export const changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);


		const { oldPassword, newPassword } = req.body;

		
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}


		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailsender(
				updatedUserDetails.email,
				passwordUpdate(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
		
		} catch (error) {
		
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

	
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};