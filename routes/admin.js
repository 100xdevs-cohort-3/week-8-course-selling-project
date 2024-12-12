const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");

// Imported the dependencies!
const bcrypt = require('bcrypt');
const { z } = require('zod');

const  { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/admin");


adminRouter.post("/signup", async function(req, res) {

    // First lets add the input validation here!

    const requiredBody = z.object({
        email: z.string().email(),
        password: z.string().min(3).max(100), // Adjust the min , max length according to you!
        firstName: z.string().min(2).max(100), // Adjust the min , max length according to you!
        lastName: z.string().min(2).max(100) // Adjust the min , max length according to you!
    })

    // parse the req.body:

    const parseDataWithSuccess = requiredBody.safeParse(req.body);

    // Now checking and warning whether the user/admin has given some invalid input or not

    if (!parseDataWithSuccess.success) {
        res.status(400).json({
            msg: "Invalid Input Given",
            errors: parseDataWithSuccess.error.issues
        })
        return
    }

    // uptill here input validation is done, now proceed!!

    const { email, password, firstName, lastName } = req.body;
    // hashing the password so plaintext password is not stored in the Database

    // Code error handled with try catch

    let errorFound = false;
    try {
        const hashedPassword = await bcrypt.hash(password , 10);
        
        await adminModel.create({
            email: email,
            password: hashedPassword,
            firstName: firstName, 
            lastName: lastName
        })

    }
    catch(e) {
        res.status(400).json({
            msg: "Email entered Already Exists in the Database!"
        })
        errorFound = true;
    }

    if (!errorFound) {
        res.json({
            msg: `${firstName} Successfully SignedUP to the database, as ADMIN!`
        })
    }
})

adminRouter.post("/signin", async function(req, res) {
    // First lets add the input validation here!

    const requiredBody = z.object({
        email: z.string().email(),
        password: z.string().min(3).max(100), // Adjust the min , max length according to you!
    })

    // parse the req.body:

    const parseDataWithSuccess = requiredBody.safeParse(req.body);

    // Now checking and warning whether the user/admin has given some invalid input or not

    if (!parseDataWithSuccess.success) {
        res.status(400).json({
            msg: "Invalid Input Given",
            errors: parseDataWithSuccess.error.issues
        })
        return
    }

    // uptill here input validation is done, now proceed!!
    
    const { email, password } = req.body;
    
    // First check if the admin exists in our database or not!
    
    const admin = await adminModel.findOne({
        email: email,
    });

    if (!admin) {
        res.status(401).json({
            msg: `Admin Doesn't exists in our database with email: ${email}!`
        })
        return
    }

    const decryptedPassword = await bcrypt.compare(password , admin.password);

    // CHECK IF THE USERNAME AND PASSWORD MATCHED OR NOT!!


    if (!decryptedPassword) {
        res.status(403).json({
            msg: "Admin not Found, INCORRECT CREDENTIALS!!"
        })
    }
    else { // MAIN LOGIC: HERE ASSIGN THE JWT TO THE ADMIN
        const token = jwt.sign({
            id: admin._id
        } , JWT_ADMIN_PASSWORD);

        // Do cookie logic

        res.json({
            msg: `${admin.firstName} Successfully LoggedIN!!`,
            token: token
        })
    }
})

adminRouter.post("/course", adminMiddleware, async function(req, res) {
    // First lets add the input validation here!

    const requiredBody = z.object({
        title: z.string(),
        description: z.string().min(3).max(100), // Adjust the min , max length according to you!
        imageUrl: z.string().min(2),
        price: z.number()
    })

    // parse the req.body:

    const parseDataWithSuccess = requiredBody.safeParse(req.body);

    // Now checking and warning whether the user/admin has given some invalid input or not

    if (!parseDataWithSuccess.success) {
        res.status(400).json({
            msg: "Invalid Input Given",
            errors: parseDataWithSuccess.error.issues
        })
        return
    }

    // uptill here input validation is done, now proceed!!
    
    const adminId = req.userId;

    const { title, description, imageUrl, price } = req.body;

    // creating a web3 saas in 6 hours
    const course = await courseModel.create({
        title: title, 
        description: description, 
        imageUrl: imageUrl, 
        price: price, 
        creatorId: adminId
    })

    res.json({
        message: "Course created",
        courseId: course._id,
        courseTitle: title
    })
})

adminRouter.put("/update-course", adminMiddleware, async function(req, res) {
    const requiredBody = z.object({
        title: z.string(),
        description: z.string().min(3).max(100), // Adjust the min , max length according to you!
        imageUrl: z.string().min(2),
        price: z.number(),
        courseId: z.string()
    })

    // parse

    const parsedDataWithSuccess = requiredBody.safeParse(req.body);

    if (!parsedDataWithSuccess.success) {
        res.status(400).json({
            msg: "INVALID INPUT",
            error: parsedDataWithSuccess.error.issues
        })
        return
    }

    // UPTILL HERE input validation is done!

    const adminId = req.userId;

    const { title, description, imageUrl, price, courseId } = req.body;
    
    // FIRST OF ALL, EXPLICITILY CHECK THAT WHETHER THAT COURSE IS PRESENT FOR THAT PARTICULAR ADMIN OR NOT!
    const courseCheck = await courseModel.findOne({
        _id: courseId,
        creatorId: adminId
    })

    if (!courseCheck) {
        res.status(401).json({
            msg: "No course Found!!!!"
        })
        return
    }
    
    const course = await courseModel.updateOne({
        _id: courseId, 
        creatorId: adminId 
    }, {
        title: title, 
        description: description, 
        imageUrl: imageUrl, 
        price: price
    })

    res.json({
        message: "Course updated",
        courseId: course._id
    })
})

adminRouter.get("/course/bulk", adminMiddleware,async function(req, res) {
    const adminId = req.userId;

    const courses = await courseModel.find({
        creatorId: adminId 
    });

    res.json({
        message: "Course updated",
        courses
    })
})

module.exports = {
    adminRouter: adminRouter
}