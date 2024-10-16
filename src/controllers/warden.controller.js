import { Admin } from "../models/admin.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { Complaint } from "../models/complaints.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllComplaints=asyncHandler(async(req,res)=>{
    const complaints=await Complaint.find({status:{$ne:"Closed"}}).populate("submittedBy","firstName regNumber");
    if(!complaints){
        res.status(200).json(
            new ApiResponse(200,[],"No Complaints Found"),
        )
    }
    res.status(200).json(
        new ApiResponse(200,complaints,"All Complaints"),
    );
});

const updateComplaintStatus=asyncHandler(async(req,res)=>{
    const {complaintId,status}=req.body;
    if(status!=="Resolved"&&status!=="InProgress"){
        res.status(400).json(
            new ApiResponse(400,[],"Invalid Status"),
        )
    }
    await Complaint.updateOne({_id:complaintId},{status});
    res.status(200).json(
        new ApiResponse(200,[],"Status Updated"),
    );
})
export {getAllComplaints,updateComplaintStatus};