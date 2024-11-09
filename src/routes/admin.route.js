import { Router } from "express";
import { adminVerifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { loginAdmin, registerAdmin } from "../controllers/admin.controller.js";
import { getAllComplaints, updateComplaintStatus } from "../controllers/warden.controller.js";
import { getStudentsLaundryRequestsSorted, updateLaundryStatusByLaundryPerson } from "../controllers/laundryAdmin.controllers.js";


const adminRouter=Router();

adminRouter.route('/register').post(registerAdmin);
adminRouter.route('/login').post(loginAdmin);
adminRouter.route('/getAllComplaints').get(adminVerifyJWT,authorizeRoles("Warden"),getAllComplaints);
adminRouter.route('/updateComplaintStatus').post(adminVerifyJWT,authorizeRoles("Warden"),updateComplaintStatus);
adminRouter.route('/getLaundryRequests').get(adminVerifyJWT,authorizeRoles("LaundryPerson"),getStudentsLaundryRequestsSorted);
adminRouter.route('/updateLaundryStatus').post(adminVerifyJWT,authorizeRoles("LaundryPerson"),updateLaundryStatusByLaundryPerson);
export default adminRouter;