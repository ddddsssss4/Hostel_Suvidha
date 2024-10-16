import { Admin } from '../models/admin.models.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Complaint } from '../models/complaints.models.js';


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

const generateAccessAndRefreshToken=async(userId)=>{
    try{
        const admin=await Admin.findById(userId);
        const accessToken=admin.generateAccessToken();
        const refreshToken=admin.generateRefreshToken();
        admin.refreshToken=refreshToken;
        await admin.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
    }catch{
        throw new ApiError(500, "something went wrong while generating the access and refresh token ")
    }
}

const loginAdmin=asyncHandler(async(req,res)=>{
    const {username,password}=req.body;
    if(!username||!password){
        throw new ApiError(400,"Username and password are required");
    }
    const admin=await Admin.findOne({username});
    if(!admin){
        throw new ApiError(404,"Admin not found");
    }
    const isPasswordCorrect=await admin.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        throw new ApiError(401,"Invalid Password");
    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(admin._id);
    const loggedInAdmin=await Admin.findById(admin._id).select("-password -refreshToken");
    const options={
        httpOnly:true,
        secure:true
    }
    return res.
    status(200).
    cookie("accessToken",accessToken,options).
    json(
        new ApiResponse(
            200,
            {
                admin:loggedInAdmin,accessToken
            },
            "Admin Logged In successfully"
        )
    );
}
)



const getAllComplaints=asyncHandler(async(req,res)=>{
    const complaints=await Complaint.find({status:{$ne:"Closed"}});
    res.status(200).json(new ApiResponse(200,complaints,"All Complaints"));
})

export { registerAdmin ,loginAdmin};
