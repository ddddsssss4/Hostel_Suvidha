import express from "express";
import cors from "cors";

const app=express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use (express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))

import studentRouter from "./routes/student.route.js";
import complaintRouter from "./routes/complaint.route.js";
// import the routers

app.use("/api/v1/students",studentRouter)
app.use("/api/v1/complaints",complaintRouter)



export  {app}