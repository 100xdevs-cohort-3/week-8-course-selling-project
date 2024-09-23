import jwt from "jsonwebtoken";

function auth(req, res, next) {
  const authHeader = req.cookies.auth_token;

  if (!authHeader) {
    return res
      .status(403)
      .json({ message: "No token provided or incorrect format" });
  }

  try {
    const decoded = jwt.verify(authHeader, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

export default auth;
