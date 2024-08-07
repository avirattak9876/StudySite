 import express from "express";
import { authorize } from "../middleware/authorization.js";
import { deleteAccount, getAllUserDetails, updateDisplayPicture, updateProfile } from "../controllers/profile.js";

 const profileRouter = express.Router();

 profileRouter.delete("/deleteProfile",authorize,deleteAccount);
 profileRouter.put("/updateProfile", authorize, updateProfile);
profileRouter.get("/getUserDetails", authorize, getAllUserDetails);
profileRouter.put("/updateDisplayPicture", authorize, updateDisplayPicture);

export default profileRouter;
