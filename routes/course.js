
function createCourseRoutes(app) {

    app.post("/course/purchase", function(req, res) {
        // you would expect the user to pay you money
        res.json({
            message: "signup endpoint"
        })
    })

    app.get("/course/preview", function(req, res) {
        res.json({
            message: "signup endpoint"
        })
    })
}

module.exports = {
    createCourseRoutes: createCourseRoutes
}