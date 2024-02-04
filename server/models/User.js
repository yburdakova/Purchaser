import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
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
        password:{
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true
        },
        contactName:{
            type: String,
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

export const User = mongoose.model('User', UserSchema);