import mongoose from 'mongoose';

const PriceHistorySchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const ProductSchema = new mongoose.Schema(
    {
        customId: {
            type: String,
            unique: true
        },
        title: {
            type: String,
            required: true,
            unique: true
        },
        description: {
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
        },
        priceHistory: [PriceHistorySchema]
    },
    {
        timestamps: true
    }
)

export const Product = mongoose.model('Product', ProductSchema);