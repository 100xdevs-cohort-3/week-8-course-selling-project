import { Router } from "express";
import { User } from "../schema.js";
import { Purchase } from "../schema.js";
import { Course } from "../schema.js";
import bcrypt from "bcrypt";
import auth  from "../middlewares/auth.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
const userRouter = Router();

const saltRounds = 10;

userRouter.route("/").get((req,res)=>{
  res.send("hello from user")
})

userRouter.route('/signup').post(async(req,res)=>{
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({
      message: "Please provide all the details"
    });
  }

  try {

    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    } 

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      email,
      password:hashedPassword,
      username
    });

    if(!newUser){
      return res.status(400).json({
        message: "User not created"
      })
    } else{
      res.status(201).json({
        message: "You are signed up",
        userId: newUser._id 
      });
    }


   
  } catch (error) {
    // Catch any unexpected errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }

 
    res.status(500).json({
      message: "An internal server error occurred",
      error: error.message
    });
  }})


userRouter.route('/signin').post(async(req,res)=>{
  const { email, password} = req.body;
  if(!email || !password){
   return res.status(400).send("Please add all fields")
  }

  else{
    const user = await User.findOne({email})
    if(!user){
      return res.status(400).send("Invalid Credentials")}

      else{
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if(!isPasswordMatch){
          return res.status(400).send("Invalid Credentials")
        }
        else{
          const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
          res.status(200).json({
            message: "Login Successful",
            token
          })
        }
      }
    } 
})

userRouter.route('/purchaseCourse').post(auth,async(req,res)=>{
  const { courseId } = req.body;
  const userId = req.userId;

   // Validate if the courseId is a valid ObjectId
   if (!mongoose.isValidObjectId(courseId)) {
    return res.status(400).json({
      message: "Invalid course ID format"
    }); 
  }


  const checkIfCourseExists = await Course.findById(courseId)
  if(!checkIfCourseExists){
    return res.status(400).json({
      message: "Course does not exist"
    })}

  const checkIfAlreadyPurchased = await Purchase.findOne({userId,courseId})
  if(checkIfAlreadyPurchased){
    return res.status(400).json({
      message: "You have already purchased this course"
    })} else{
      const newPurchase = await Purchase.create({
        userId,
        courseId  
      })

      if(!newPurchase){
        return res.status(400).json({
          message: "failed to purchase course"
        })}
        else{
          return res.status(201).json({
            message: "Course purchased successfully"
          })
        }
    
  }
})
userRouter.route('/checkIfAlreadyPurchased').post(auth,async(req,res)=>{
  const { courseId } = req.body;
  const userId = req.userId;  
  const checkIfAlreadyPurchased = await Purchase.findOne({userId,courseId})
  if(checkIfAlreadyPurchased){
    return res.status(400).json({
      message: "You have already purchased this course"
    })} else{
      return res.status(200).json({
        message: "You have not purchased this course"
      })
    }
})


userRouter.get('/getAllPurchasedCourses', auth, async (req, res) => {
  const userId = req.userId;
  
  const purchasedCourses = await Purchase.find({ userId });
  
  if (!purchasedCourses.length) { // Check if no purchased courses found
    return res.status(400).json({
      message: "No purchased courses found",
    });
  } else { 
    try {
      const data = await Promise.all(
        purchasedCourses.map(async (course) => {
          const courseData = await Course.findById(course.courseId).select('-password');
          return courseData; // Return the courseData to be collected in an array
        })
      );

      return res.status(200).json({
        message: "Purchased courses found",
        data,
      });
    } catch (error) {
      console.error("Error fetching course data:", error);
      return res.status(500).json({
        message: "Error fetching course data",
      });
    }
  }
});

userRouter.route('/getUserDetails').get(auth,async(req,res)=>{
  const userId = req.userId;
  const checkIfUserExists = await User.findById(userId).select('-password');

  if(!checkIfUserExists){
    return res.status(400).json({
      message: "User does not exist"
    })
  }
  else{
    return res.status(200).json({
      message: "User found",
      user: checkIfUserExists
    })
  }
}   
)
export default userRouter;