import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { changePassword, getComplaints, giveFeedback, loginStudent, registerStudent } from "../controllers/student.controller.js";
import { studentVerifyJWT } from "../middlewares/auth.middleware.js";
import { createLaundryRequest, getStudentLaundryRequests, updateLaundryStatusByStudent } from "../controllers/laundry.controllers.js";
import { newComplaint } from "../controllers/complaint.controller.js";


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
studentRouter.route('/changePassword').post(
    studentVerifyJWT,
    changePassword
)
studentRouter.route('/laundry').post(
    studentVerifyJWT,
    createLaundryRequest
)
studentRouter.route('/updateLaundryStatus').post(
    studentVerifyJWT,
    updateLaundryStatusByStudent
)
studentRouter.route('/getLaundryRequests').get(
    studentVerifyJWT,
    getStudentLaundryRequests
)
studentRouter.route('/newComplaint').post(
    studentVerifyJWT,newComplaint
);
studentRouter.route('/allComplaints').get(
    studentVerifyJWT,getComplaints
);
studentRouter.route('/giveFeedback').post(
    studentVerifyJWT,giveFeedback
);
export default studentRouter;