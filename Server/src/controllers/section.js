import { Course } from "../models/courseModels.js";
import {Section} from "../models/sectionModels.js"
import { SubSection } from "../models/subsectionModels.js";

export const createSection = async(req,res)=>{


      try{
        const{sectionName,courseId} = req.body;

        if(!sectionName || !courseId){
          return res.status(400).json({
              success:false,
              message:'All fields are required',
          });
        }
  
        const newSection = await Section.create({sectionName});
  
        const updateCourseDetails = await Course.findByIdAndUpdate(courseId,
          {$push:{courseContent: newSection._id}},{new:true}).populate({
              path: 'courseContent',
              populate: { path: 'subSection' }
            });
        
            return res.status(200).json({
              success:true,
              message:'Section created successfully',
              updateCourseDetails
          })   
      }

      catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to create Section',
            error: error.message,
        })
      }
       
      
}

export const updateSection = async (req,res) => {
    try {
        
        const {sectionId, sectionName, courseId} = req.body;

        if (!sectionId || !sectionName) {
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }

        const updatedSection = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});
        const updatedCourse = await Course.findById(courseId)
          .populate({
              path:"courseContent",
              populate: {
                  path:"subSection"
              }});
        return res.status(200).json({
            success:true,
            message:'Section updated successfully',
            updatedCourse
        })   
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to update Section',
            error: error.message,
        })
    }
}

export const deleteSection = async (req, res) => {
    try {
        const { sectionId, courseId } = req.body;

        if (!sectionId || !courseId) {
            return res.status(400).json({
                success: false,
                message: 'Both sectionId and courseId are required',
            });
        }

        await Section.findByIdAndDelete(sectionId);
        console.log('Section deleted');

        await Course.findByIdAndUpdate(courseId, {
            $pull: { courseContent: sectionId }
        });

      
        const updatedCourse = await Course.findById(courseId)
          .populate({
              path: "courseContent",
              populate: { path: "subSection" }
          });

        return res.status(200).json({
            success: true,
            message: 'Section deleted successfully',
            updatedCourse
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete Section',
            error: error.message,
        });
    }
};
