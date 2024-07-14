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