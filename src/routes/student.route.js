import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { loginStudent, registerStudent } from "../controllers/student.controller.js";


const studentRouter=Router();

studentRouter.route('/register').post(
    upload.fields([
        {
            name:"profileImage",
            maxCount:1
        }
    ]),
    registerStudent
)
studentRouter.route('/login').post(
    loginStudent
)
export default studentRouter;