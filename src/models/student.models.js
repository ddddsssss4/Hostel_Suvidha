import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";

const studentSchema=mongoose.Schema(
    {
        regNumber:{
            type:String,
            unique:true,
            required:true,
        },
        password:{
            type:String,
            required:[true,"Password is required"],
            trim:true,

        },
        fullName:{
            type:String,
            required:true,
            trim:true,

        },
        hostel:{
            type:String,
            required:true,
            trim:true,
            
        },
        roomNumber:{
            type:String,
            required:true,
        },
        profileImage:{
            type:String,
            required:true,
            trim:true
        },
        refreshToken:{
            type:String
        }
    },
    {
        timestamps:true
    }
)

studentSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }this.password=await bcrypt.hash(this.password,10);
    next();
})
studentSchema.methods.isPasswordCorrect=async function(password){
    console.log(password);
    console.log(this.password)
    return await bcrypt.compare(password,this.password)
}
studentSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this.id,
            
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
studentSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this.id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Student=mongoose.model("Student",studentSchema);