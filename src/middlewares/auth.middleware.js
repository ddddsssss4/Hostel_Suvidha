import { Admin } from "../models/admin.models.js";
import { Student } from "../models/student.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const studentVerifyJWT=asyncHandler(async(req,res,next)=>{
    try{
        const token=req.cookies?.accessToken
        ||req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new ApiError(401,"Unauthorized Request. No token available")
            
        }
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const student=await Student.findById(decodedToken?._id).select("-password -refreshToken")
        if(!student){
            throw new ApiError(401,"Invalid token")
            
        }
        req.student=student;
        
        next()
    }catch(error){
        throw new ApiError(401,error.message)

    }
})

const adminVerifyJWT = asyncHandler(async (req, res, next) => {
    const token=req.cookies?.accessToken
    ||req.header("Authorization")?.replace("Bearer ","")
    if (!token) {
        throw new ApiError(401, "Unauthorized access! ");
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const admin = await Admin.findById(decoded._id);
        

        if (!admin ) {
            throw new ApiError(404, "Admin not found.");
        }

        req.admin = admin ;
       req.adminType=admin.adminType;
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid access token.");
    }
});

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.adminType)) {
            throw new ApiError(403, "Access denied.");
        }
        next();
    };
};

export { adminVerifyJWT, authorizeRoles };
