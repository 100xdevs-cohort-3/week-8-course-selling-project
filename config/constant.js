import dotenv from "dotenv";

dotenv.config();

const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;
const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD;
const MONGODB_URI = process.env.MONGODB_URI;

export { JWT_USER_PASSWORD, JWT_ADMIN_PASSWORD, MONGODB_URI };
