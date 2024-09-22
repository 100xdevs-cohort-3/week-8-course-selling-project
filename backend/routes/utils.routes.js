import { Router } from "express";
import { Course } from "../schema.js";


const utilsRouter = Router();

utilsRouter.route("/utils").get((req,res)=>{
  res.send("hello from utils")
})

utilsRouter.route('/course/:courseId').get( async (req, res) => {
  const {courseId} = req.params;
  console.log("ccourseId",courseId)

  const checkIfCourseExists = await Course.findById(courseId);
  if (!checkIfCourseExists) {
    return res.status(400).json({
      message: "Course does not exist",
    });
  } else {
    return res.status(200).json({
      message: "Course found",
      course: checkIfCourseExists,
    });
  }
});

utilsRouter.route('/deleteCourse/:courseId').get( async (req, res) => {
  const {courseId} = req.params;
  const checkIfCourseExists = await Course.findById(courseId);
  if (!checkIfCourseExists) {
    return res.status(400).json({
      message: "Course does not exist",
    });
  } else {
    await Course.deleteOne({_id:courseId})
    return res.status(200).json({
      message: "Course deleted successfully",
    });
  }
});
utilsRouter.route('/getAllCourses').get( async (req, res) => {
  const courses = await Course.find();
  if (!courses) {
    return res.status(400).json({
      message: "No courses found",
    });
  } else {
    return res.status(200).json({
      message: "Courses found",
      courses,
    });
  }
});
export default utilsRouter;