import { Router } from "express";
import { userMiddleware } from "../middlewares/user.middlewares.js";
import { userModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_USER_PASSWORD } from "../config/constant.js";
import { signinSchema, signupSchema } from "../schemas/user.schemas.js";
import { purchaseModel } from "../models/purchase.model.js";
import { courseModel } from "../models/course.model.js";

export const signupController = async function (req, res) {
  try {
    // validation the request body using signupSchema
    const signupResult = signupSchema.safeParse(req.body);
    if (!signupResult.success) {
      return res.status(400).json({
        message: signupResult.error.issues[0].message,
        success: false,
      });
    }

    const { email, password, firstName, lastName } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    if (!user) {
      return res
        .status(500)
        .json({ message: "User signup failed", success: false });
    }

    res
      .status(201)
      .json({ message: "User signed up successfully", success: true });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

export const signinController = async function (req, res) {
  try {
    // Validation the request body using signinSchema
    const signinResult = signinSchema.safeParse(req.body);
    if (!signinResult.success) {
      return res.status(400).json({
        message: signinResult.error.issues[0].message,
        success: false,
      });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Incorrect password", success: false });
    }

    const token = jwt.sign({ id: user._id }, JWT_USER_PASSWORD);

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .cookie("token", token, options)
      .json({ message: "Signed in successfully", success: true });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

export const signoutController = async function (req, res) {
  try {
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("token", options)
      .json({ message: "User signed out successfully", success: true });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

export const purchaseController = async function (req, res) {
  try {
    const userId = req.userId;

    const purchases = await purchaseModel.find({ userId });

    if (purchases.length === 0) {
      return res
        .status(400)
        .json({ message: "No course available", success: false });
    }

    const purchasedCourseIds = purchases.map((purchase) => purchase.courseId);

    const coursesData = await courseModel.find({
      _id: { $in: purchasedCourseIds },
    });

    res.status(200).json({
      message: "Fetched courses successfully",
      success: true,
      courses: coursesData,
    });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};
