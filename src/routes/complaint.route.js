import { Router } from "express";
import { studentVerifyJWT } from "../middlewares/auth.middleware.js";
import { newComplaint } from "../controllers/complaint.controller.js";

const complaintRouter=Router();

complaintRouter.route('/new').post(studentVerifyJWT,newComplaint)
export default complaintRouter;