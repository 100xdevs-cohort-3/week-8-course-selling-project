import jwt from "jsonwebtoken";
import { JWT_USER_PASSWORD } from "../config/constant.js";

function userMiddleware(req, res, next) {
  try {
    const token =
      req.headers?.token ||
      req.cookies?.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    const decoded = jwt.verify(token, JWT_USER_PASSWORD);

    if (decoded) {
      req.userId = decoded.id;
      next();
    } else {
      res.status(403).json({
        message: "You are not signed in",
      });
    }
  } catch (error) {
    res.status(403).json({
      message: "Invalid token",
    });
  }
}

export { userMiddleware };
