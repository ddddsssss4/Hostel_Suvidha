import { Complaint } from "../models/complaints.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const newComplaint=asyncHandler(async(req,res)=>{
    //take the user details and the other details 
    //and just create a new complaint 
    const {title,description,complaintType}=req.body;
    if(!title||!description||!complaintType){
        throw new ApiError(400,"Enter the title and description");
    }

    const validComplaintTypes = ['Electronic', 'Furniture', 'Washroom', 'RoomService', 'Desciplinary', 'Wifi'];
    if (!validComplaintTypes.includes(complaintType)) {
        throw new ApiError(400, "Invalid complaint type");
    }
    const complaint=await Complaint.create({
        title,
        description,
        complaintType,
        roomNumber:req.student.roomNumber,
        submittedBy:req.student._id
    })
    res
    .status(201)
    .json(new ApiResponse(201,complaint,"Complaint Sumbitted Successfully!"))
})
export{newComplaint}