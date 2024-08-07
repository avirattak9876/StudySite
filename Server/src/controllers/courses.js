import { User } from "../models/userModels.js"
import {Category} from "../models/categoryModels.js"
import { Course } from "../models/courseModels.js";
import { uploadCloudinary } from "../utils/ulpoadCloudinary.js";
import mongoose from "mongoose";

export const createCourse = async(req,res) =>{

     try{
        const{courseName,courseDescription,whatYouWillLearn,price,category,tags} = req.body;

        const thumbnail = req.files.thumbnailImg;
    
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail ) {
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }
    
        const userId = req.user.id;
        const objectId = new mongoose.Types.ObjectId(userId);
        const instructorDetails = await User.findOne(objectId);
    
        if(!instructorDetails){
            return res.status(401).json({
                success:false,
                message:"Instructor Details Not Valid"
            })
        }
    
        const categoryDetails =  await Category.findById(category);
        if(!categoryDetails){
            return res.status(401).json({
                success:false,
                message:"Category not found"
            })
        }
    
        const thumbnailImage = await uploadCloudinary(thumbnail,process.env.Folder_Name);
    
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
           whatYouWillLearn,
            price,
            thumbnail:thumbnailImage.secure_url,
            category,
            tags,
          
        });
    
        await User.findByIdAndUpdate(
            userId,{$push : {courses:newCourse}},{new:true});
    
        await Category.findByIdAndUpdate(category,
                {
                    $push: {
                        course: newCourse._id
                    }
                },{new:true})
    
     return res.status(200).json({
            success:true,
            message:'Course created successfully',
            newCourse
                })   
     }
     catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to create Course',
            error: error.message,
        })
     }
     

}

export const showAllCourses = async (req,res) => {
    try {
        const allCourses = Course.find({}, {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentsEnroled: true,
        }).populate("instructor").exec();

        return res.status(200).json({
            success:true,
            message:'Data for all courses fetched successfully',
            data:allCourses,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to show all Courses',
            error: error.message,
        })
    }
}


export const getcourseDetail = async(req,res)=>{
        
    try{
           
        const {courseId} = req.body;

        const courseDetails = await Course.findById(courseId)
        .populate({
            path:"instructor",
            populate:{
                path:"additionalDetails",
            }
        }).populate("category")
        //.populate("ratingAndReviews")
        .populate({
            path:"courseContent",
            populate:{
                path:"subSection",
            },
        })
        .exec();

        if(!courseDetails) {
            return res.status(400).json({
                success:false,
                message:`Could not find the course with ${courseId}`,
            });
        }

        return res.status(200).json({
            success:true,
            message:"Course Details fetched successfully",
            courseDetails,
        })

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to get all Courses',
            error: error.message,
        })
    }
}
