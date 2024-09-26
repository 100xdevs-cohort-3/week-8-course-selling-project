import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/database.js";

import { userRouter } from "./routes/user.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { courseRouter } from "./routes/courses.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Mongodb connection failed !!! ${err}`);
  });
