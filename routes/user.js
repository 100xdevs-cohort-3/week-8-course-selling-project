const express = require("express");
const { userModel, purchaseModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middleware/user");
const bcrypt = require("bcrypt"); // For hashing passwords
const { z } = require("zod"); // For validation

const userRouter = express.Router();

// Zod schema for validating user input
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6), // Adjust the minimum length as needed
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

userRouter.post("/signup", async function (req, res) {
  try {
    // Validate request body
    const { email, password, firstName, lastName } = signupSchema.parse(req.body);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in the database
    await userModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    res.json({
      message: "Signup succeeded",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred during signup",
    });
  }
});

userRouter.post("/signin", async function (req, res) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await userModel.findOne({ email });

    // Check if user exists and compare hashed passwords
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        {
          id: user._id,
        },
        JWT_USER_PASSWORD
      );

      // Cookie logic can be added here

      res.json({
        token,
      });
    } else {
      res.status(403).json({
        message: "Incorrect credentials",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred during signin",
    });
  }
});

userRouter.get("/purchases", userMiddleware, async function (req, res) {
  try {
    const userId = req.userId;

    // Fetch purchases for the user
    const purchases = await purchaseModel.find({
      userId,
    });

    // Extract course IDs from purchases using map
    const purchasedCourseIds = purchases.map((purchase) => purchase.courseId);

    // Fetch course data for the purchased course IDs
    const coursesData = await courseModel.find({
      _id: { $in: purchasedCourseIds },
    });

    res.json({
      purchases,
      coursesData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching purchases",
    });
  }
});

module.exports = {
  userRouter,
};
