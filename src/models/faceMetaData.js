import mongoose from "mongoose";

const faceMetaDataSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    faceId:{
        type:String,
        required:true,
        unique:true
    },
    registrationNumber:{
        type:String,
        unique:true,
        required:true
    },
});
const FaceMetaData=mongoose.model("FaceMetaData",faceMetaDataSchema);
export {FaceMetaData}