import { purchaseModel } from "../models/purchase.model.js";
import { courseModel } from "../models/course.model.js";
import { purchaseSchema } from "../schemas/course.schemas.js";

export const purchaseCourseController = async function (req, res) {
  try {
    // validation the request body using purchaseSchema
    const purchaseResult = purchaseSchema.safeParse(req.body);
    if (!purchaseResult.success) {
      return res.status(400).json({
        message: purchaseResult.error.issues[0].message,
        success: false,
      });
    }

    const userId = req.userId;
    const { courseId } = req.body;

    // Todo: should check that the user has actually paid the price
    const existingPurchase = await purchaseModel.findOne({
      userId,
      courseId,
    });
    if (existingPurchase) {
      return res.status(400).json({
        message: "You have already purchased this course",
        success: false,
      });
    }

    // Todo: should check that the course exists
    const existingCourse = await courseModel.findOne({ _id: courseId });
    if (!existingCourse) {
      return res
        .status(400)
        .json({ message: "Course not found", success: false });
    }

    const purchase = await purchaseModel.create({
      userId,
      courseId,
    });

    if (!purchase) {
      return res
        .status(400)
        .json({ message: "Failed to purchase the course", success: false });
    }

    res.status(200).json({
      message: "You have successfully bought the course",
      success: true,
      purchaseId: purchase._id,
    });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

export const previewCourseController = async function (req, res) {
  try {
    const courses = await courseModel.find({});

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
