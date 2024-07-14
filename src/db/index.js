import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB=async()=>{
    try{
        console.log(process.env.PORT);
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/`)
        console.log(`MongoDb connected!! DB HOST: ${connectionInstance.connection.host}`);
    }catch(e){
        console.log("Error",e);
        process.exit(1);
    }
}
export default connectDB;