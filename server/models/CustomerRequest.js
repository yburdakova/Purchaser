import mongoose from 'mongoose';

const CustomerRequestSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
        },
        phone:{
            type: String,
            required: true,
        },
        isProcessed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

export const CustomerRequest = mongoose.model('CustomerRequest', CustomerRequestSchema);