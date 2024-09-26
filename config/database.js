import mongoose from "mongoose";
import { MONGODB_URI } from "./constant.js";

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${MONGODB_URI}`);
    console.log(
      `MongoDB connected on DB HOST::::::::::::::: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(`MongoDB connection failed::::::::::: ${error}`);
    process.exit(1);
  }
};
