import mongoose from "mongoose";

const allGateLogs=new mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student',
        required:true
    },
    status:{
        type:String,
        enum:['In','Out'],
        
    }
},{timestamps:true})    

export const AllGateLogs=mongoose.model('AllGateLogs',allGateLogs)