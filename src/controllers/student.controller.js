import { ApiResponse } from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js"

import { ApiError } from "../utils/ApiError.js";
import { Student } from "../models/student.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Complaint } from "../models/complaints.models.js";

//register form is required by the developer to add the student in the databse easily as we will not give the user to register on the apploication it is only login
const registerStudent=asyncHandler(async(req,res)=>{
    const {fullName,regNumber,password,hostel,roomNumber}=req.body;
    if(
        [fullName,password,regNumber,hostel,roomNumber].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(400,"All Fields are Compulsory")
    }
    const existedStudent=await Student.findOne({
        regNumber
    })
    if(existedStudent){
        throw new ApiError(409,"Student with the Registration Number already exists")
    }
    const profileImageLocalPath=req.files?.profileImage[0]?.path;
    if(!profileImageLocalPath){
        throw new ApiError(400,"Profile Picture is Required")

    }
    const profileImage=await uploadOnCloudinary(profileImageLocalPath);
    if(!profileImage){
        throw new ApiError(400,"Profile Image Field Required")

    }
    const student=await Student.create({
        fullName,
        profileImage:profileImage.url,
        password,
        hostel,
        roomNumber,
        regNumber
    })
    const createdStudent=await Student.findById(student._id).select(
        "-password -refreshToken"
    );
    if(!createdStudent){
        throw new ApiError(500,"Something went wrong while regisetring the student")
    }

    return res.status(201).json(
        new ApiResponse(201,createdStudent,"Student Registered Successfully")
    )

})

//generate and the access token is require for presisting the state of the application

const generateAccessAndRefreshToken=async(userId)=>{
    try{
        const student=await Student.findById(userId);
        const accessToken=student.generateAccessToken();
        const refreshToken=student.generateRefreshToken();
        student.refreshToken=refreshToken;
        await student.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
    }catch{
        throw new ApiError(500, "something went wrong while generating the access and refresh token ")
    }
}

const loginStudent=asyncHandler(async(req,res)=>{
    const {regNumber,password}=req.body;
    if(!regNumber||!password){
        throw new ApiError(400,"Registartion Number or Password not entered");
    }
    const student=await Student.findOne({regNumber});
    if(!student){
        throw new ApiError(404,"User not found");
    }
    console.log(student);
    const isPasswordCorrect=await student.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        throw new ApiError(401,"Please enter a Valid Password!")
    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(student._id);
    const loggedInStudent=await Student.findById(student._id).select("-password -refreshToken");
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
         new ApiResponse(
            200,
            {
                student:loggedInStudent,accessToken,refreshToken
            },
            "Student Logged In successfully"
        )
    )


})

const changePassword = asyncHandler(async (req, res) => {
    const student = req.student; // Retrieved from the middleware
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Validate the input
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        throw new ApiError(400, "All fields are required");
    }

    if (newPassword !== confirmNewPassword) {
        throw new ApiError(400, "New password and confirm new password do not match");
    }

    const studentDoc = await Student.findById(student._id).select('+password');

    if (!studentDoc) {
        throw new ApiError(404, "Student not found");
    }

    // Check if the current password is correct
    const isPasswordCorrect = await studentDoc.isPasswordCorrect(currentPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Current password is incorrect");
    }

    // Update the password
    studentDoc.password = newPassword;
    await studentDoc.save();
    res.status(200).json(new ApiResponse(200, null, "Password changed successfully"));

});

const getComplaints=asyncHandler(async(req,res)=>{
    const student=req.student;
    const complaints=await Complaint.find({submittedBy:student._id});
    if(!complaints){
        return res.status(200).json(new ApiResponse(200,[],"No complaints Submitted!"));
    }
    return res.status(200).json(new ApiResponse(200,complaints,"Complaints Fetched Successfully!"));

});

export {registerStudent,loginStudent,changePassword,getComplaints}