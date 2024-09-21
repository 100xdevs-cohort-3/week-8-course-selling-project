const express = require("express");
const { userRouter } = require("./routes/user");
const { createCourseRoutes } = require("./routes/course");
const app = express();

app.use("/user", userRouter);
app.use("/course", courseRouter);

createUserRoutes(app);
createCourseRoutes(app);

app.listen(3000);