import mongoose from "mongoose";
import zod from "zod";

// zod validation for admin signup schema
const signupSchema = zod.object({
  email: zod.string().email("Invalid email address"),
  password: zod.string().min(8, "Password must be at least 8 characters long"),
  firstName: zod
    .string()
    .min(2, "First name must be at least 2 characters long"),
  lastName: zod.string().min(2, "Last name must be at least 2 characters long"),
});

// zod validation for admin signin schema
const signinSchema = zod.object({
  email: zod.string().email("Invalid email address"),
  password: zod.string().min(8, "Password must be at least 8 characters long"),
});

// zod validation for course create schema
const createCourseSchema = zod.object({
  title: zod.string().min(3, "Title must be at least 3 characters long"),
  description: zod
    .string()
    .min(10, "Description must be at least 10 characters long"),
  imageUrl: zod.string().url("Image URL must be a valid URL"),
  price: zod.number().min(0, "Price must be a non-negative number"),
});

// zod validation for course update schema
const updateCourseSchema = zod.object({
  title: zod
    .string()
    .min(3, "Title must be at least 3 characters long")
    .optional(),
  description: zod
    .string()
    .min(10, "Description must be at least 10 characters long")
    .optional(),
  imageUrl: zod.string().url("Image URL must be a valid URL").optional(),
  price: zod.number().min(0, "Price must be a non-negative number").optional(),
  courseId: zod
    .string()
    .refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: "Course ID must be a valid MongoDB ObjectId",
    }),
});

export { signupSchema, signinSchema, createCourseSchema, updateCourseSchema };
