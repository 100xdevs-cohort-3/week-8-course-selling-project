# Create a course selling app

- **STEP 1:** Initialize a new Node.js project
- **STEP 2:** Add "npm i express jsonwebtoken mongoose dotenv bcrypt cookie-parser" to it as a dependency
- **STEP 3:** Create index.js
- **STEP 4:** Add route skeleton for user login, signup, purchase a course, sees all courses, sees the purchased courses course
- **STEP 5:** Add routes for admin login, admin signup, create a course, delete a course, add course content.
- **STEP 6:** Define the schema for User, Admin, Course, Purchase
- **STEP 7:** Add a database (mongodb), use dotenv to store the database connection string
- **STEP 8:** Add middlewares for user and admin auth
- **STEP 9:** Complete the routes for user login, signup, purchase a course, see course (Extra points - Use express routing to better structure your routes)
- **STEP 10:** Create the frontend

# Good to haves

- **TODO 1:** Use cookies instead of JWT for auth
- **TODO 2:** Add a rate limiting middleware
- **TODO 3:** Frontend in ejs (low pri)
- **TODO 4:** Frontend in React

# API Endpoints

## User

| Endpoint | Method | Body | Response | Description |
| --- | --- | --- | --- | --- |
| /api/v1/user/signup | POST | {email: string, password: string, firstName: string, lastName: string} | {message: string, success: boolean} | User signup |
| /api/v1/user/signin | POST | {email: string, password: string} | {message: string, success: boolean} | User signin |
| /api/v1/user/purchases | POST | {courseId: string} | {message: string, success: boolean, courses: courses} | Purchase a course |
| /api/v1/user/signout | GET | {} | {message: string, success: boolean} | User signout |

## Admin

| Endpoint | Method | Body | Response | Description |
| --- | --- | --- | --- | --- |
| /api/v1/admin/signup | POST | {email: string, password: string, firstName: string, lastName: string} | {message: string, success: boolean}  | Admin signup |
| /api/v1/admin/signin | POST | {email: string, password: string} | {message: string, success: boolean} | Admin signin |
| /api/v1/admin/signout | GET | {} | {message: string, success: boolean} | Admin signout |
| /api/v1/admin/course | POST | {title: string, description: string, imageUrl: string, price: number} | {message: string, success: boolean, courseId: string} | Create a course |
| /api/v1/admin/course | PUT | {title: string, description: string, imageUrl: string, price: number, courseId: string} | {message: string, success: boolean} | Update a course |
| /api/v1/admin/course/bulk | GET | {} | {message: string, success: boolean, courses: courses} | See all courses |

## Course

| Endpoint | Method | Body | Response | Description |
| --- | --- | --- | --- | --- |
| /api/v1/course/purchase | POST | {courseId: string} | {message: string, success: boolean, courses: courses} | Purchase a course |
| /api/v1/course/preview | GET | {} | {message: string, success: boolean, courses: courses} | See all courses |
