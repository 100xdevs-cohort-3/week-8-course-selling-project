import { Router } from "express";
import { adminMiddleware } from "../middlewares/admin.middlewares.js";
import {
  allCoursesController,
  createCourseController,
  signinController,
  signoutController,
  signupController,
  updateCourseController,
} from "../controllers/admin.controllers.js";

const adminRouter = Router();

adminRouter.post("/signup", signupController);

adminRouter.post("/signin", signinController);

adminRouter.get("/signout", adminMiddleware, signoutController);

adminRouter.post("/course", adminMiddleware, createCourseController);

adminRouter.put("/course", adminMiddleware, updateCourseController);

adminRouter.get("/course/bulk", adminMiddleware, allCoursesController);

export { adminRouter };
