    
 import { instance } from "../connection/razorpay.js";
 import { User } from "../models/userModels.js";
 import { Course } from "../models/courseModels.js";
 import mailsender from "../utils/mailSender.js";
 import { courseEnrollmentEmail } from "../mail/templates/courseEnrollmentEmail.js";
import mongoose from "mongoose";


  export const capturePayment = async(req,res)=>{
        
      const {course_id} = req.body;
      const userId = req.user.id;

      if(!course_id){
        return res.json({
            success:false,
            message:"Provide courseId"
        })
      }

      let course;
      try{
         course = await Course.findById(course_id);

         if(!course){
            return res.status(200).json({
                success:false,
                message:"Course doesn't exist"
            })}

            const uid = mongoose.Types.ObjectId(userId);

            if(course.studentEnrolled.includes(uid)){
              return res.status(200).json({
                success:false,
                message:"Course doesn't exist"
            });    
        }
      }
      catch(error){
        return res.status(500).json({
          success:false,
          message:error.message
      });
      }

       
      const amount = course.price;
      const currency = "INR";

      const options = {
         amount : amount *100,
         currency:currency,
         receipt : Math.random(Date.now()).toString(),
         notes:{
            courseId:course_id,
            userId,
         }
      }

      try{
         //order create
        const paymentResponse = await instance.orders.create(options);
        console.lof(paymentResponse);
        res.status(200).json({
          success:true,
          message: paymentResponse,
          courseName : course.courseName,
          courseDescription:course.courseDescription,
          orderId:paymentResponse.id,
          amount:paymentResponse.amount
      })
      }

      catch(error){
        console.log(error);
        return res.status(500).json({success:false, mesage:"Could not Initiate Order"});
      }

  } 



  export const verifySignature = async(req,res)=>{
        
      const webhookSecret = process.env.RAZOR_SECRET;

       const signature = req.headers["x-razorpay-signature"];

       const shasum = crypto.createHmac("sha256",webhookSecret);
       shasum.update(JSON.stringify(req.body));
       const expectetdsign = shasum.digest("hex");

       if(expectetdsign == signature){
             
        const {courseId,userId} = req.body.payload.payment.entity.notes;

           try{
                 
              const updatedCourse = await Course.findByIdAndUpdate({_id : courseId},{$push:{
                studentEnrolled:userId
              }},{new:true});

              if (!enrolledCourse) {
                return res.status(500).json({success:false,message:"Course not Found"});
            }

            const updatedStudent = await User.findByIdAndUpdate(userId, {
              $push: {
                  courses: courseId,
                  courseProgress: courseProgress._id,
              }
          }, {new: true});

          const emailResponse = await mailsender( updatedStudent.email,
            `Successfully Enrolled into ${updatedCourse.courseName}`,
            courseEnrollmentEmail(updatedCourse.courseName, `${updatedStudent.firstName}`)
        );


        return res.status(200).json({success:true, message:"Payment Verified and Course Added"});

           }
           catch(error){
            console.log(error);
            return res.status(500).json({success:false, message:error.message});
           }
       }
      

       return res.status(400).json({success:false, message:"Invalid Request"});

  }