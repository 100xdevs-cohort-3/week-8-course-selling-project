import { Router } from "express";
import { Admin } from "../schema.js";
import bcrypt from "bcrypt";
import auth  from "../middlewares/auth.js";
import jwt from "jsonwebtoken";
import { Course } from "../schema.js";
import { upload } from "../middlewares/multer.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
const adminRouter = Router();

const saltRounds = 10;

adminRouter.route("/").get((req,res)=>{
  res.send("hello from admin")
})

// adminRouter.route('/signup').post(async(req,res)=>{
//   const { email, password, adminname } = req.body;

//   if (!email || !password || !adminname) {
//     return res.status(400).json({
//       message: "Please provide all the details"
//     });
//   }

//   try {

//     const existingAdmin = await Admin.findOne({ email });
    
//     if (existingAdmin) {
//       return res.status(400).json({
//         message: "Admin already exists"
//       });
//     } 

//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     const newAdmin = await Admin.create({
//       email,
//       password:hashedPassword,
//       adminname
//     });

//     if(!newAdmin){
//       return res.status(400).json({
//         message: "Admin not created"
//       })
//     } else{
//       res.status(201).json({
//         message: "You are signed up",
//         userId: newAdmin._id 
//       });
//     }


   
//   } catch (error) {
//     // Catch any unexpected errors
//     if (error.name === 'ValidationError') {
//       return res.status(400).json({
//         message: 'Validation error',
//         errors: Object.keys(error.errors).map(key => ({
//           field: key,
//           message: error.errors[key].message
//         }))
//       });
//     }

 
//     res.status(500).json({
//       message: "An internal server error occurred",
//       error: error.message
//     });
//   }})


adminRouter.route('/signin').post(async(req,res)=>{
  const { email, password} = req.body;
  if(!email || !password){
   return res.status(400).send("Please add all fields")
  }

  else{
    const admin = await Admin.findOne({email})
    if(!admin){
      return res.status(400).send("Invalid Credentials")}

      else{
        const isPasswordMatch = await bcrypt.compare(password, admin.password)
        if(!isPasswordMatch){
          return res.status(400).send("Invalid Credentials")
        }
        else{
          const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET);
          res.status(200).json({
            message: "Login Successful",
            token
          })
        }
      }
    } 
})

adminRouter.route('/createCourse').post(upload.fields([
    {
        name:"imageUrl",
        maxCount:1,

    }
]),auth, async (req, res) => {

    const imageLocalPath = req.files?.imageUrl[0]?.path
  

  if (!imageLocalPath) {
    return res.status(400).json({
      message: "Course images is required",
    });
  }
  
   const image = await uploadOnCloudinary(imageLocalPath)

   if (!image ){
       return res.status(400).json({
         message: "Course images failed to upload",
       });
      }

    const { title, description,  price,imageUrl } = req.body;
   console.log(imageUrl)                                  
    if (!title || !description || !price) {
      return res.status(400).send("Please add all fields");
    }
  
    const adminId = req.userId;
  
    const checkIfCourseExists = await Course.findOne({ title, author: adminId });
    if (checkIfCourseExists) {
      return res.status(400).json({
        message: "Course already exists",
      });
    } else {
      const newCourse = await Course.create({
        title,
        description,
        imageUrl:image.secure_url,
        author: adminId,
        price,
      });
  
      if (!newCourse) {
        return res.status(400).json({
          message: "Failed to create course",
        });
      } else {
        return res.status(201).json({
          message: "Course created successfully",
        });
      }
    }
  });

adminRouter.route('/getAllCourses').get(auth, async (req, res) => {
  const adminId = req.userId;
  const courses = await Course.find({ author: adminId });
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


  
export default adminRouter;