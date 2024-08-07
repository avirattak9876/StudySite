import  jwt  from "jsonwebtoken"

 export const authorize = async (req,res,next)=>{
          
       try{
           
        const token = req.cookies.token || req.body.token || req.get("Authorization")?.replace("Bearer ", "");

           if(!token){
            return res.status(401).json({
                success:false,
                message:'Token is missing',
            });
           }
           //verify karo token
           try{
            const payload = jwt.verify(token,process.env.JWT_SECRET);
             req.user = payload
           }

           catch(err){
            return res.status(401).json({
                success:false,
                message:"Invaild token."
            })
           }

           next();
       }
       catch(error){
        console.log(error)
        return res.status(401).json({
            success:false,
            message:"Error in validating token"
        })
       }
 }


 export const isStudent = async (req,res,next) =>{
         
    try{
        if(req.user.accountType !== "Student") {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Students only',
            });
        }
        next();
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified, please try again'
        })
    }
 }

 export const isInstructor = async(req,res,next) => {
    try{
        if(req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Instructor only',
            });
        }
        next();
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified, please try again'
        })
    }
}

export const isAdmin = async (req, res, next) => {
    try{
           if(req.user.accountType !== "Admin") {
               return res.status(401).json({
                   success:false,
                   message:'This is a protected route for Admin only',
               });
           }
           next();
    }
    catch(error) {
       return res.status(500).json({
           success:false,
           message:'User role cannot be verified, please try again'
       })
    }
   }