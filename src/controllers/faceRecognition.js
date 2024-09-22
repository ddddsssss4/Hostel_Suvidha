
import fs from 'fs';
import {compareFaces, uploadAndIndexImage} from "../utils/FaceRecognition.js";
import  {ApiError } from "../utils/ApiError.js";
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Student } from '../models/student.models.js';
import StudentGateLog from '../models/studentGateLog.models.js';
import { AllGateLogs } from '../models/allGateLog.models.js';
const verifyFaces=asyncHandler(async(req,res)=>{
    const image1Path = req.files.image1[0].path;
    
    
    
    
        const image1Bytes = fs.readFileSync(image1Path);
       
        
        const {name,registrationNumber}=await compareFaces(image1Bytes);
        fs.unlinkSync(image1Path);
        const student=await Student.findOne({regNumber:registrationNumber});
        if(!student){
            throw new ApiError(404,"Student not found");
        }
        var gateLog=await StudentGateLog.findOne({student:student._id});
        const currentTime = new Date();
        
        
        if(!gateLog){
            console.log("reached");
            gateLog=await StudentGateLog.create({
                student:student._id,
                status:"Out",
            });
            await AllGateLogs.create({
                student:student._id,
                status:"Out"
            });
            
        }else{
            const lastUpdatedTime = new Date(gateLog.updatedAt);
            const timeDifference = (currentTime - lastUpdatedTime) / (1000 * 60); // Difference in minutes
            console.log(timeDifference);
            if (timeDifference >= 1) {
                // Update the status only if 1 minutes have passed since the last update
                gateLog.status = gateLog.status === "Out" ? "In" : "Out";
                const entry=await AllGateLogs.create({
                    student:student._id,
                    status:gateLog.status
                });
                await gateLog.save(); // This will automatically update the `updatedAt` timestamp
            } else {
                console.log("reached");
                throw new ApiError(400, `You cannot go ${gateLog.status === "Out" ? "In" : "Out"} within 1 minutes of the last update.`);
            }
        } 

        res.status(200).json(new ApiResponse(200,gateLog.status,"Person Logged Successfully"));
    

    

    

})

const uploadImagesOnAWS=asyncHandler(async(req,res)=>{
    const {name,registrationNumber}=req.body;
    const image=fs.readFileSync(req.files.image[0].path);
    
    const {success} =await uploadAndIndexImage(image,name,registrationNumber);
    if(success){
        res.status(200).json(new ApiResponse(200,success,"Image is uploaded successfully!"));
    }
    else{
        throw new ApiError(500,"Error Uploading the Image");
    }
})
export {verifyFaces,uploadImagesOnAWS}