import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'InProgress', 'Resolved', 'Closed'],
            default: 'Pending',
        },
        complaintType:{
            type: String,
            enum: ['Electronic', 'Furniture', 'Washroom', 'RoomService','Desciplinary','Wifi'],
            
        },
        roomNumber: {
            type: String,
            required: true,
            trim: true,
        },
        submittedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
        },
        // resolvedBy: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Admin',
        //     default: null,
        // },
        resolutionNotes: {
            type: String,
            trim: true,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

export const Complaint = mongoose.model('Complaint', complaintSchema);
