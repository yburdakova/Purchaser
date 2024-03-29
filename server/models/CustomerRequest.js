import mongoose from 'mongoose';

const CustomerRequestSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        contactName: {
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
        },
        contactPhone:{
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['newUser', 'newPassword', 'completed', 'rejected'],
            required: true,
        },
        data: mongoose.Schema.Types.Mixed
    },
    {
        timestamps: true
    }
)

export const CustomerRequest = mongoose.model('CustomerRequest', CustomerRequestSchema);