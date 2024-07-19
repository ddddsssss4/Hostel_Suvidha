import { Laundry } from '../models/laundry.models.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const createLaundryRequest = asyncHandler(async (req, res) => {
    const { tShirts, pants, shirts, lowers, bedsheets } = req.body;
    const student = req.student;

    if (!tShirts && !pants && !shirts && !lower && !bedsheets) {
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
        }
    });

    await newRequest.save();

    res.status(201).json(new ApiResponse(201, newRequest, "Laundry request created successfully."));
});

const updateLaundryStatus = asyncHandler(async (req, res) => {
    const { requestId, status } = req.body;

    if (!['Submitted', 'Accepted', 'Delivered'].includes(status)) {
        throw new ApiError(400, "Invalid status value.");
    }

    const laundryRequest = await Laundry.findById(requestId);

    if (!laundryRequest) {
        throw new ApiError(404, "Laundry request not found.");
    }

    laundryRequest.status = status;
    await laundryRequest.save();

    res.status(200).json(new ApiResponse(200, laundryRequest, "Laundry status updated successfully."));
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


export { createLaundryRequest, updateLaundryStatus ,getStudentLaundryRequests};
