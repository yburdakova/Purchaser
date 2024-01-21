import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        decription: {
            type: String,
        },
        category: { 
            type: String,
        },
        measure: {
            type: String,
            default: "кг"
        },
        price: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Product = mongoose.model('Product', ProductSchema);