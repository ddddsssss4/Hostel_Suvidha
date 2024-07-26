import { Router } from "express";
import { adminVerifyJWT } from "../middlewares/auth.middleware.js";
import { registerAdmin } from "../controllers/admin.controller.js";


const adminRouter=Router();

adminRouter.route('/register').post(registerAdmin);
export default adminRouter;