import {
  createCourseSchema,
  updateCourseSchema,
  signinSchema,
  signupSchema,
} from "../schemas/admin.schemas.js";
import { JWT_ADMIN_PASSWORD } from "../config/constant.js";
import { adminModel } from "../models/admin.model.js";
import bcrypt from "bcrypt";
import { courseModel } from "../models/course.model.js";
import jwt from "jsonwebtoken";

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

    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await adminModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    if (!admin) {
      return res
        .status(500)
        .json({ message: "Admin signup failed", success: false });
    }

    res
      .status(201)
      .json({ message: "Admin signed up successfully", success: true });
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

    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res
        .status(404)
        .json({ message: "Admin not found", success: false });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Incorrect password", success: false });
    }

    const token = jwt.sign({ id: admin._id }, JWT_ADMIN_PASSWORD);

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
      .json({ message: "Admin signed out successfully", success: true });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

export const createCourseController = async function (req, res) {
  try {
    // validation the request body using createCourseSchema
    const createCourseResult = createCourseSchema.safeParse(req.body);
    if (!createCourseResult.success) {
      return res.status(400).json({
        message: createCourseResult.error.issues[0].message,
        success: false,
      });
    }

    const adminId = req.userId;
    const { title, description, imageUrl, price } = req.body;

    const course = await courseModel.create({
      title: title,
      description: description,
      imageUrl: imageUrl,
      price: price,
      creatorId: adminId,
    });

    if (!course) {
      return res
        .status(500)
        .json({ message: "Course creation failed", success: false });
    }

    res.status(201).json({
      message: "Course created successfully",
      success: true,
      courseId: course._id,
    });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

export const updateCourseController = async function (req, res) {
  try {
    // validation the request body using updateCourseSchema
    const updateCourseResult = updateCourseSchema.safeParse(req.body);
    if (!updateCourseResult.success) {
      return res.status(400).json({
        message: updateCourseResult.error.issues[0].message,
        success: false,
      });
    }

    const adminId = req.userId;
    const { title, description, imageUrl, price, courseId } = req.body;

    const existingCourse = await courseModel.findOne({ _id: courseId });
    if (!existingCourse) {
      return res
        .status(400)
        .json({ message: "Course not found", success: false });
    }

    const course = await courseModel.updateOne(
      {
        _id: courseId,
        creatorId: adminId,
      },
      {
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
      }
    );

    res.status(200).json({
      message: "Course updated successfully",
      success: true,
      courseId: course._id,
    });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

export const allCoursesController = async function (req, res) {
  try {
    const adminId = req.userId;

    const courses = await courseModel.find({
      creatorId: adminId,
    });

    if (courses.length === 0) {
      return res
        .status(400)
        .json({ message: "No course available", success: false });
    }

    res.status(200).json({
      message: "Fetched courses successfully",
      success: true,
      courses: courses,
    });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};
