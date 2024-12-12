const { Router } = require("express");
const { userMiddleware } = require("../middleware/user");
const { purchaseModel, courseModel } = require("../db")
const courseRouter = Router();

courseRouter.post("/purchase", userMiddleware, async function (req, res) {
    const userId = req.userId;
    const courseId = req.body.courseId;

    // Firstly We've to check that whether that course is available or not!!

    const courseExistance = await courseModel.findOne({
        _id: courseId
    })

    if (!courseExistance) {
        res.status(400).json({
            msg: "NO COURSE AVAILABLE!!!"
        })
        return
    }

    // Now Secondly WE've to prevent the user to buy a course twice.

    const alreadyPurchased = await purchaseModel.findOne({
        courseId: courseId
    })

    if (alreadyPurchased) {
        res.status(400).json({
            msg: "This course has already been purhcased!!"
        })
        return
    }

    // should check that the user has actually paid the price

    await purchaseModel.create({
        userId,
        courseId
    })

    res.json({
        message: "You have successfully bought the course"
    })
})

courseRouter.get("/preview", async function (req, res) {

    const courses = await courseModel.find({});

    res.json({
        courses
    })
})

module.exports = {
    courseRouter: courseRouter
}