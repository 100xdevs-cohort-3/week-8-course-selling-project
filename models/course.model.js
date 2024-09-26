import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const courseSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  creatorId: {
    type: ObjectId,
    ref: "user",
  },
});

const courseModel = mongoose.model("course", courseSchema);

export { courseModel };
