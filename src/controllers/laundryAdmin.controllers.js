import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Laundry } from '../models/laundry.models.js';


const getStudentsLaundryRequestsSorted = asyncHandler(async (req, res) => {
    //get all the Laundry Request accordin to the Laundry Admin to whom the rooms are assigned
    const laundryAdmin=req.admin;
    const adminType=req.adminType;
    if(adminType!="LaundryPerson"){
        throw new ApiError(403,"Access Denied")
    }
    const laundryRequests = await Laundry.find({handeledBy:laundryAdmin._id}).populate("student","name regNumber roomNumber").sort({createdAt:-1});
    if(!laundryRequests){
        res.status(200).json(new ApiResponse(200,[],"No laundry requests found."));
    }
    res.status(200).json(new ApiResponse(200, laundryRequests, "Laundry requests fetched successfully."));
}
);

const updateLaundryStatus = asyncHandler(async (req, res) => {
    const {'requestId':requestId, 'status':status} = req.body;
    const laundryAdmin=req.admin;
    const adminType=req.adminType;
    if(adminType!=="LaundryAdmin"){
        throw new ApiError(403,"Access Denied")
    }
    if(!['Accepted', 'Delivered','Ready'].includes(status)){
        throw new ApiError(400,"Invalid status value.")
    }
    const laundryRequest = await Laundry.findById(requestId);
    if(!laundryRequest){
        throw new ApiError(404,"Laundry request not found.")
    }
    laundryRequest.status=status;
    await laundryRequest.save();
    res.status(200).json(new ApiResponse(200,laundryRequest,"Laundry status updated successfully."))
}
);

export {
    getStudentsLaundryRequestsSorted,
    updateLaundryStatus
}