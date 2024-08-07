  
import express from "express";
import { changePassword, createOTP, login, signUP } from "../controllers/authentication.js";
import { authorize } from "../middleware/authorization.js";
import { resetPassword, resetPasswordToken } from "../controllers/resetPassword.js";

  const userRouter = express.Router();

  userRouter.post("/login",login);
  userRouter.post("/signUp",signUP);
  userRouter.post("/sendotp", createOTP);
  userRouter.post("/changepassword", authorize, changePassword);
  userRouter.post("/reset-password-token", resetPasswordToken);
  userRouter.post("/reset-password", resetPassword);

  export default userRouter;