import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const purchaseSchema = new Schema({
  userId: {
    type: ObjectId,
    ref: "user",
  },
  courseId: {
    type: ObjectId,
    ref: "course",
  },
});

const purchaseModel = mongoose.model("purchase", purchaseSchema);

export { purchaseModel };
