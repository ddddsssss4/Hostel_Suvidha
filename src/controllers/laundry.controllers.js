import { Laundry } from '../models/laundry.models.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Admin } from '../models/admin.models.js';

const createLaundryRequest = asyncHandler(async (req, res) => {
    const { tShirts, pants, shirts, lowers, bedsheets } = req.body;
    const student = req.student;
  
    const laundryAdmin = await Admin.findOne({
        adminType: 'LaundryPerson',
        assignedRooms: req.student.roomNumber
    });

    if (!laundryAdmin) {
        throw new ApiError(404, "No laundry admin found for the student's room.");
    }

    if (!tShirts && !pants && !shirts && !lowers && !bedsheets) {
        throw new ApiError(400, "You must specify the number of clothes.");
    }

    const newRequest = new Laundry({
        student: student._id,
        clothes: {
            tShirts: tShirts || 0,
            pants: pants || 0,
            shirts: shirts || 0,
            lowers: lowers || 0,
            bedsheets: bedsheets || 0
        },
        handeledBy: laundryAdmin._id
    });

    await newRequest.save();

    res.status(201).json(new ApiResponse(201, newRequest, "Laundry request created successfully."));
});

const updateLaundryStatusByStudent = asyncHandler(async (req, res) => {
    const { requestId, status } = req.body;
    const studentId = req.student._id;
    // Only allow specific status updates for students, including "Closed" and "Cancelled"
    if (!['Closed', 'Cancelled'].includes(status)) {
        throw new ApiError(400, "Invalid status value for student.");
    }

    const laundryRequest = await Laundry.findById(requestId).populate("student");
    if (!laundryRequest) {
        throw new ApiError(404, "Laundry request not found.");
    }
    //console.log(laundryRequest.student._id, studentId);
    if (laundryRequest.student._id.toString() !== studentId.toString()) {
        throw new ApiError(403, "Access Denied: You can only update your own laundry request.");
    }
   
    if (status === "Cancelled") {
        if (["Delivered", "Closed"].includes(laundryRequest.status)) {
            throw new ApiError(400, "Cannot cancel a delivered or closed request.");
        }
        laundryRequest.status = "Cancelled";
    } else if (status === "Closed") {
        if(laundryRequest.status === "Closed"){
            throw new ApiError(400, "Laundry request is already closed.");
        } 
        if (laundryRequest.status !== "Delivered") {
            throw new ApiError(400, "Laundry request has not been delivered yet.");
        }
        laundryRequest.status = "Closed";
    }

    await laundryRequest.save();
    const returnRequest = await Laundry.findById(requestId);
    res.status(200).json(new ApiResponse(200, returnRequest, "Laundry status updated successfully."));
});



const getStudentLaundryRequests = asyncHandler(async (req, res) => {
    const studentId = req.student._id; // Assuming req.student is set by a middleware after verifying the access token
    
    const laundryRequests = await Laundry.aggregate([
        { $match: { student: studentId } },
        {
            $addFields: {
                totalClothes: {
                    $add: [
                        { $ifNull: ["$clothes.tShirts", 0] },
                        { $ifNull: ["$clothes.pants", 0] },
                        { $ifNull: ["$clothes.shirts", 0] },
                        { $ifNull: ["$clothes.lowers", 0] },
                        { $ifNull: ["$clothes.bedsheets", 0] }
                    ]
                }
            }
        },
        { $sort: { createdAt: -1 } }
    ]);

    if (!laundryRequests.length) {
        return res.status(200).json(new ApiResponse(200, [], "No laundry requests found for this student."));
    }

    res.status(200).json(new ApiResponse(200, laundryRequests, "Laundry requests retrieved successfully."));
});





export { createLaundryRequest, updateLaundryStatusByStudent ,getStudentLaundryRequests};
