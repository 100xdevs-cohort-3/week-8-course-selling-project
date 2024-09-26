import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,
  firstName: String,
  lastName: String,
});

const userModel = mongoose.model("user", userSchema);

export { userModel };
