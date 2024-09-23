import express from "express";
import { connectDB } from "./db/index.js";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";
import utilsRouter from "./routes/utils.routes.js";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

dotenv.config({
  path: "./.env",
});

const app = express();
app.use(express.json());
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100, //100 requests in 1 minute
  message: "Too many requests, please try again later.",
});

app.use(limiter);

// Enable CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Define routes
app.get("/", (req, res) => {
  return res.send("home page");
});

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/details", utilsRouter);

const port = process.env.PORT || 8000;

connectDB()
  .then(
    app.listen(port, () => {
      console.log(`Server is running at ${port}`);
    })
  )
  .catch((err) => {
    console.log("MONGO db connection failed", err);
  });
