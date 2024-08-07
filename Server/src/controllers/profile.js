import { Profile } from "../models/profileModels.js";
import { User } from "../models/userModels.js";
import { uploadCloudinary } from "../utils/ulpoadCloudinary.js";


  export const updateProfile = async(req,res)=>{
    try {
        
        const {dateOfBirth="", gender, about="", contactNumber } = req.body;
        
        const userId = req.user.id

        if(!contactNumber || !gender ) {
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        } 

        const userDetails = await User.findById(userId);
        const profileId = userDetails.additionalDetails;

        const updatedProfile = await Profile.findByIdAndUpdate(profileId, {dateOfBirth, gender, about, contactNumber}, {new:true});
        const updatedUserDetails = await User.findById(userId).populate("additionalDetails").exec();
        return res.status(200).json({
            success:true,
            message:'Profile updated successfully',
            updatedUserDetails
        })   
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to update profile',
            error: error.message,
        })
    }
  }

  export const deleteAccount = async (req,res) =>{
    try {
       
        const userId = req.user.id

       
        const userDetails = await User.findById(userId);
         if(!userDetails) {
             return res.status(404).json({
                success:false,
                message:'User not found',
            });
        }         

        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});

        await User.findByIdAndDelete({_id:userId});

        return res.status(200).json({
            success:true,
            message:'User deleted successfully',
        })   
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to delete User',
            error: error.message,
        })
    }
}


export const getAllUserDetails = async (req, res) => {

    try {
        
        const id = req.user.id;
        
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
       
        return res.status(200).json({
            success:true,
            message:'User Data Fetched Successfully',
            userDetails
        });
       
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}




export const updateDisplayPicture = async(req,res)=>{
      
    try{
        const displayPicture = req.files.displayFile;
        const userId = req.user.id;

        const image = await uploadCloudinary(displayPicture,process.env.Folder_Name);

        const updatedProfile = await User.findByIdAndUpdate(userId,{image : image.secure_url},{new:true});

        res.status(200).json({
          success: true,
          message: `Image Updated successfully`,
          data: updatedProfile,
        })

    }

    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
          })
    }
       
          

}
