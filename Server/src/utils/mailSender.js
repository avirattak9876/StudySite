import nodemailer from "nodemailer";

const mailsender = async(email,title,body)=>{
      
    try{
          
        let transporter = nodemailer.createTransport({
              host:process.env.MAIL_HOST,
              auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
              }
        })

        let info = await transporter.sendMail({
             from: "StudyNotion by Avirat",
             to: email,
             subject: title,
             html: body
        })

        return info;
    }

    catch(err){
          
        console.log(err.message);
    }
}

export default mailsender