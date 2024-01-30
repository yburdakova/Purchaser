import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema(
    {
        title: {
          type: String,
          required: true,
          unique: true
        },
        email:{
          type: String,
          required: true,
          unique: true
        },
        contactName:{
            type: String,
            required: true
        },
        contactPhone:{
          type: String,
          required: true,
        },
        extraInfo:{
          type: String,
        },
    },
    {
        timestamps: true
    }
)

export const Customer = mongoose.model('Customer', CustomerSchema);