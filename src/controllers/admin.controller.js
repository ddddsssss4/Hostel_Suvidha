import { Admin } from '../models/admin.models.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerAdmin = asyncHandler(async (req, res) => {
    const { fullName,username, password, adminType, assignedRooms } = req.body;
    if (!fullName||!username || !password || !adminType) {
        throw new ApiError(400, "Username, password, and admin type are required.");
    }

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
        throw new ApiError(409, "Admin with this username already exists.");
    }

    const newAdmin = new Admin({ 
        fullName,
        username, 
        password, 
        adminType,
        assignedRooms: adminType === 'LaundryPerson' ? assignedRooms : []
    });
    

    await newAdmin.save();

    const createdAdmin=await Admin.findById(newAdmin._id).select(
        "-password -refreshToken"
    );
    
    res.status(201)
        
        .json(new ApiResponse(201, createdAdmin, "Admin registered successfully."));
});

export { registerAdmin };
