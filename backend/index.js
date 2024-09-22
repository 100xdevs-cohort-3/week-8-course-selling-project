import express from "express";
import { connectDB } from "./db/index.js";
import dotenv from "dotenv"
import cors from 'cors'
import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";
import utilsRouter from "./routes/utils.routes.js";

dotenv.config({
    path: './.env'
})

const app = express();
app.use(express.json())

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

// routes

app.get('/',(req,res)=>{
    return res.send("home page")
})

app.use('/user',userRouter);
app.use('/admin',adminRouter); 
app.use('/details',utilsRouter); 



const port = process.env.PORT || 8000


connectDB()
.then(
    app.listen(port, () => {
        console.log(`Server is running at ${port}`);
    })
)
.catch((err) => {
    console.log("MONGO db connection failed", err);
})
