import express from "express";
import { authorize, isAdmin, isInstructor, isStudent } from "../middleware/authorization.js";
import { createCourse, getcourseDetail, showAllCourses } from "../controllers/courses.js";
import { categoryPageDetails, createCategory, showAllCategory } from "../controllers/category.js";
import { createRating, getAllRating, getAverageRating } from "../controllers/rating&review.js";
import { createSection, deleteSection, updateSection } from "../controllers/section.js";
import { createsubSection, deleteSubSection, updatesubSection } from "../controllers/subsection.js";

const courseRouter = express.Router();

courseRouter.post("/createCourse", authorize, isInstructor, createCourse);
courseRouter.get("/getAllCourses", showAllCourses);
courseRouter.get("/getCourseDetails", getcourseDetail);

courseRouter.post("/addSection", authorize, isInstructor, createSection)
courseRouter.put("/updateSection", authorize, isInstructor, updateSection)
courseRouter.delete("/deleteSection", authorize, isInstructor, deleteSection)

courseRouter.put("/updateSubSection", authorize, isInstructor, updatesubSection)
courseRouter.delete("/deleteSubSection", authorize, isInstructor, deleteSubSection)
courseRouter.post("/addSubSection", authorize, isInstructor, createsubSection)

courseRouter.post("/createCategory", authorize, isAdmin, createCategory);
courseRouter.get("/showAllCategories", showAllCategory);
courseRouter.post("/getCategoryPageDetails", categoryPageDetails);

courseRouter.post("/createRating", authorize, isStudent, createRating);
courseRouter.get("/getAverageRating", getAverageRating);
courseRouter.get("/getReviews", getAllRating);

export default courseRouter;