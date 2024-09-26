import { Router } from "express";
import { userMiddleware } from "../middlewares/user.middlewares.js";
import {
  purchaseController,
  signinController,
  signoutController,
  signupController,
} from "../controllers/user.controllers.js";

const userRouter = Router();

userRouter.post("/signup", signupController);

userRouter.post("/signin", signinController);

userRouter.get("/purchases", userMiddleware, purchaseController);

userRouter.get("/signout", userMiddleware, signoutController);

export { userRouter };
