import { Router } from "express";
import { userMiddleware } from "../middlewares/user.middlewares.js";
import {
  previewCourseController,
  purchaseCourseController,
} from "../controllers/course.controllers.js";
const courseRouter = Router();

courseRouter.post("/purchase", userMiddleware, purchaseCourseController);

courseRouter.get("/preview", previewCourseController);

export { courseRouter };
