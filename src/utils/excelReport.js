import { asyncHandler } from "./asyncHandler.js";
import { ApiResponse } from "./ApiResponse.js";
import { ApiError } from "./ApiError.js";
import StudentGateLog from "../models/studentGateLog.models.js";
import { Student } from "../models/student.models.js";
import exceljs from "exceljs";
const createExcelReport = asyncHandler(async (req, res) => {
    const studentGateLog=await StudentGateLog.find({status:"Out"});

    const students=await Promise.all(studentGateLog.map(async (studentLog)=>{
        const studentDetails=await Student.findById(studentLog.student).select("fullName regNumber roomNumber");
        return {
            name:studentDetails.fullName,
            regNumber:studentDetails.regNumber,
            roomNumber:studentDetails.roomNumber,
            time:studentLog.updatedAt.toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata'}),
            date:studentLog.updatedAt.toLocaleDateString('en-IN',{timeZone:'Asia/Kolkata'}),
        }
    }));
    const workbook=new exceljs.Workbook();
    const worksheet=workbook.addWorksheet("OutStudents");
    const path=`./public/excel`;
    //const fileName=`${path}/outStudents.xlsx`;
    worksheet.columns=[
        {header:"Name",key:"name",width:20},
        {header:"Registration Number",key:"regNumber",width:20},
        {header:"Room Number",key:"roomNumber",width:20},
        {header:"Time",key:"time",width:20},
        {header:"Date",key:"date",width:20}
    ];
    worksheet.addRows(students);
    const data=await workbook.xlsx.writeFile(`${path}/outStudents.xlsx`)
    .then(()=>{
       console.log("Excel Report Generated Successfully");
    }).catch((error)=>{
        throw new ApiError(500,error.message);
    });
   
});

export { createExcelReport };

