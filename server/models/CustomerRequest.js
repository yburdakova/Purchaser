import mongoose from 'mongoose';

const CustomerRequestSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            default: "Клиент"
        },
        email:{
            type: String,
            required: true,
            unique: true
        },
        contactName:{
            type: String,
        },
        contactPhone:{
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