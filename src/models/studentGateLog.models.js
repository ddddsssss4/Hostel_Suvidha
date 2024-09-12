import mongoose from "mongoose";

const studentGateLogSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        status: {
            type: String,
            enum: ['In', 'Out'],
            default: 'In'
        },
        
    },
    { timestamps: true }
    );

const StudentGateLog = mongoose.model('StudentGateLog', studentGateLogSchema);
export default StudentGateLog;
