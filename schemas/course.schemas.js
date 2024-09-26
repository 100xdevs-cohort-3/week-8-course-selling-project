import mongoose from "mongoose";
import zod from "zod";

// zod validation for purchasing course schema
const purchaseSchema = zod.object({
  courseId: zod
    .string()
    .refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: "Course ID must be a valid MongoDB ObjectId",
    }),
});

export { purchaseSchema };
