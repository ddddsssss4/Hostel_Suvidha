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

const updateLaundryStatusByLaundryPerson = asyncHandler(async (req, res) => {
    const { requestId, status } = req.body;
    const laundryAdmin = req.admin;
    const adminType = req.adminType;

    // Check if the user is authorized as a laundry person
    if (adminType !== "LaundryPerson") {
        throw new ApiError(403, "Access Denied");
    }

    const laundryRequest = await Laundry.findById(requestId);
    if (!laundryRequest) {
        throw new ApiError(404, "Laundry request not found.");
    }

    // Define allowed statuses for the laundry person, excluding "Cancelled"
    const allowedStatuses = ["AcceptedLaundry", "Ready", "Done", "Expected Delivery", "Delay", "Delivered"];

    if (status === "Cancelled") {
        throw new ApiError(403, "Laundry person cannot cancel the request.");
    }

    if (laundryRequest.status === "Submitted" && status === "AcceptedLaundry") {
        laundryRequest.status = status;
    } else if (laundryRequest.status === "AcceptedLaundry" || allowedStatuses.includes(laundryRequest.status)) {
        if (status === "Delivered" || allowedStatuses.includes(status)) {
            laundryRequest.status = status;
        } else {
            throw new ApiError(400, "Invalid status transition.");
        }
    } else if (laundryRequest.status === "Delivered") {
        throw new ApiError(400, "Cannot update status. Laundry is already delivered.");
    } else {
        throw new ApiError(400, "Invalid status transition.");
    }

    await laundryRequest.save();
    res.status(200).json(new ApiResponse(200, laundryRequest, "Laundry status updated successfully."));
});

export {
    getStudentsLaundryRequestsSorted,
    updateLaundryStatusByLaundryPerson
}