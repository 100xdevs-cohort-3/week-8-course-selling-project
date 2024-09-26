import mongoose from "mongoose";

const Schema = mongoose.Schema;

const adminSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,
  firstName: String,
  lastName: String,
});

const adminModel = mongoose.model("admin", adminSchema);

export { adminModel };
