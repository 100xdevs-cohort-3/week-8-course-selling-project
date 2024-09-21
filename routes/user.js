const { Router } = require("express");

const userRouter = Router();

userRouter.post("/signup", function(req, res) {
    res.json({
        message: "signup endpoint"
    })
})

userRouter.post("/signin", function(req, res) {
    res.json({
        message: "signup endpoint"
    })
})

userRouter.get("/purchases", function(req, res) {
    res.json({
        message: "signup endpoint"
    })
})

module.exports = {
    userRouter: userRouter
}