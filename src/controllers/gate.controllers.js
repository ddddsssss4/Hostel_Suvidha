import { AllGateLogs } from "../models/allGateLog.models.js";
import { Student } from "../models/student.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllGateEnteries=asyncHandler(async(req,res)=>{
    const allGateEnteries=await AllGateLogs.find().populate("student","name regNumber");
    if(!allGateEnteries){
        res.status(200).json(
            new ApiResponse(200,[],"No Gate Enteries Found"),
        )
    }
    res.status(200).json(
        new ApiResponse(200,allGateEnteries,"All Gate Enteries"),
    );
});

const getAllGateEnteriesByStudent=asyncHandler(async(req,res)=>{
    const regNumber=req.params.regNumber;
    const student=await Student.findOne({regNumber});
    const studentGateEnteries=await AllGateLogs.find({student:student._id}).populate("student","name regNumber");
    res.status(200).json(
        new ApiResponse(200,studentGateEnteries,"All Gate Enteries"),
    );
});
export{getAllGateEnteries,getAllGateEnteriesByStudent};