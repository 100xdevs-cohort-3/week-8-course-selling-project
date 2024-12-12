const { Router } = require("express");
const { userModel, purchaseModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const  { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middleware/user");

// Imported the dependencies!
const bcrypt = require('bcrypt');
const { z } = require('zod');

const userRouter = Router();

userRouter.post("/signup", async function(req, res) {

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
        
        await userModel.create({
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
            msg: `${firstName} Successfully SignedUP to the database, as USER!`
        })
    }
})

userRouter.post("/signin",async function(req, res) {
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
    
    // First check if the user exists in our database or not!
    
    const user = await userModel.findOne({
        email: email,
    });

    if (!user) {
        res.status(401).json({
            msg: `User Doesn't exists in our database with email: ${email}!`
        })
        return
    }

    const decryptedPassword = await bcrypt.compare(password , user.password);

    // CHECK IF THE USERNAME AND PASSWORD MATCHED OR NOT!!


    if (!decryptedPassword) {
        res.status(403).json({
            msg: "User not Found, INCORRECT CREDENTIALS!!"
        })
    }
    else { // MAIN LOGIC: HERE ASSIGN THE JWT TO THE ADMIN
        const token = jwt.sign({
            id: user._id
        } , JWT_USER_PASSWORD);

        // Do cookie logic

        res.json({
            msg: `${user.firstName} Successfully LoggedIN!!`,
            token: token
        })
    }
})

userRouter.get("/purchases", userMiddleware, async function(req, res) {
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId,
    });

    let purchasedCourseIds = [];

    for (let i = 0; i<purchases.length;i++){ 
        purchasedCourseIds.push(purchases[i].courseId)
    }

    const coursesData = await courseModel.find({
        _id: { $in: purchasedCourseIds }
    })

    res.json({
        purchases,
        coursesData
    })
})

module.exports = {
    userRouter: userRouter
}