import { Section } from "../models/sectionModels.js";
import { SubSection } from "../models/subsectionModels.js";
import { uploadCloudinary } from "../utils/ulpoadCloudinary.js";


export const createsubSection = async(req,res)=>{

    try{
        const {sectionId,title,timeDuration,description} = req.body;

    const video = req.files.videoFile;

    if(!sectionId || !title || !timeDuration || !description || !video){
        return res.status(400).json({
            success:false,
            message:'All fields are required',
        });
    }
     
    const uploadDetails = await uploadCloudinary(video,process.env.Folder_Name);

    const subSectionDetails = await SubSection.create({title,
        timeDuration,description,
        videoUrl: uploadDetails.secure_url});

     const updatedSection = await Section.findByIdAndUpdate(sectionId,
        {$push:{subSection:subSectionDetails._id}},{new:true}).populate("subSection")

        return res.status(200).json({
            success:true,
            message:'SubSection created successfully',
            updatedSection
        })   

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to create SubSection',
            error: error.message,
        })
    }
      
}

export const updatesubSection = async(req,res)=>{
     
    try {
        const { sectionId,subSectionId, title, description } = req.body
        const subSection = await SubSection.findById(subSectionId)
    
        if (!subSection) {
          return res.status(404).json({
            success: false,
            message: "SubSection not found",
          })
        }
    
        if (title !== undefined) {
          subSection.title = title
        }
    
        if (description !== undefined) {
          subSection.description = description
        }

        if (req.files && req.files.videoFile !== undefined) {
          const video = req.files.videoFile
          const uploadDetails = await uploadCloudinary(
            video,
            process.env.FOLDER_NAME
          )
          subSection.videoUrl = uploadDetails.secure_url
          subSection.timeDuration = `${uploadDetails.duration}`
        }
    
        await subSection.save()
    
        const updatedSection = await Section.findById(sectionId).populate("subSection")
  
  
        return res.json({
          success: true,
          data:updatedSection,
          message: "Section updated successfully",
        })
      } catch (error) {
        console.error(error)
        return res.status(500).json({
          success: false,
          message: "An error occurred while updating the section",
        })
      }
}


export const deleteSubSection = async (req,res) =>{
    try {
        
        const {subSectionId,sectionId } = req.body;
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
              $pull: {
                subSection: subSectionId,
              },
            }
          )

        if(!subSectionId) {
            return res.status(400).json({
                success:false,
                message:'SubSection Id to be deleted is required',
            });
        }

        
        const subSection = await SubSection.findByIdAndDelete(subSectionId)
  
      if (!subSection) {
        return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
      }

      const updatedSection = await Section.findById(sectionId).populate("subSection")
  
      return res.json({
        success: true,
        data:updatedSection,
        message: "SubSection deleted successfully",
      })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to delete SubSection',
            error: error.message,
        })
    }
}