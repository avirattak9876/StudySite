
import { Category } from "../models/categoryModels.js";
import { Course } from "../models/courseModels.js";

export const createCategory = async(req,res)=>{

     try{
             
        const {name,description} = req.body;

        if(!name || ! description){
           return res.status(401).json({
               success:false,
               message:"Category name or description not available"
           })
        }

        const categoryDetails = await Category.create({name,description});
        

        return res.status(200).json({
            success:true,
            message:"Category created successfully",
            categoryDetails
        })
     }
     catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
     }
      
}

export const showAllCategory = async(req,res) => {
       
    try{
           
         const allCategories = await Category.find({},{name:true,description:true});
         return res.status(200).json({
            success:true,
            message:"All Categories received",
            data:allCategories
        })  
    }

    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const categoryPageDetails = async (req,res) =>{
     
    try{
        const { categoryId } = req.body;

        const selectedCourses = await Category.findById(categoryId)
        .populate({
            path: "course",
            populate: "ratingAndReviews",
          })
          .exec()
  
      if (!selectedCourses) {
        console.log("Category not found.")
        return res
          .status(404)
          .json({ success: false, message: "Category not found" })
      }
      
      if (selectedCourses.course.length === 0) {
        console.log("No courses found for the selected category.")
        return res.status(404).json({
          success: false,
          message: "No courses found for the selected category.",
        })
      }

      const differentCourses = await Category.find({
        _id: { $ne: categoryId },
        course: { $not: { $size: 0 } }
      }).populate({
        path: "course",
        populate: "ratingAndReviews",
      })
      .exec()

      const allCategories = await Category.find({})
      .populate({
        path: "course",
        populate: "ratingAndReviews",
      })
      .exec()

    const allCourses = allCategories.flatMap((category) => category.course)
    const mostSellingCourses = await Course.find({})
    .sort({ "studentsEnrolled.length": -1 }).populate("ratingAndReviews") 


       return res.status(200).json({
          success:true,
          selectedCourses: selectedCourses,
		  differentCourses: differentCourses,
          mostSellingCourses,
          message:"Text Recieved",
       })

    }
    catch(error){
        return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
    }
}