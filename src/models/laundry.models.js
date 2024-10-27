import mongoose from "mongoose";

const laundrySchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    clothes: {
        tShirts: {
            type: Number,
            default: 0
        },
        pants: {
            type: Number,
            default: 0
        },
        shirts:{
            type: Number,
            default: 0
        },
        lowers:{
            type: Number,
            default: 0
        },
        bedsheets:{
            type: Number,
            default: 0
        }
        // Add other categories as needed
    },
    status: {
        type: String,
        enum: ['Submitted', 'Accepted', 'Delivered'],
        default: 'Submitted'
    },
    handeledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required:true
    },
    
},{timestamps:true});
laundrySchema.virtual('totalClothes').get(function () {
    const { tShirts, pants, shirts, lowers, bedsheets } = this.clothes;
    return (tShirts || 0) + (pants || 0) + (shirts || 0) + (lowers || 0) + (bedsheets || 0);
});

laundrySchema.set('toJSON', { virtuals: true });
laundrySchema.set('toObject', { virtuals: true });

const Laundry = mongoose.model('Laundry', laundrySchema);


export { Laundry };