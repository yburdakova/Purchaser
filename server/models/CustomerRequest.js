import mongoose from 'mongoose';

const CustomerRequestSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
            unique: true
        },
        phone:{
            type: String,
            required: true,
            unique: true
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