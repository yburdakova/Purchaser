import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        products: [
            {
                title: {
                    type: String,
                },
                category: { 
                    type: String,
                },
                quantity: {
                    type: Number,
                    default: 1
                },
                price: {
                    type: Number,
                },
                measure: {
                    type: String,
                },
            }
        ],
        amount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            default: "На рассмотрении"
        }
    },
    {
        timestamps: true
    }
);

export const Order = mongoose.model('Order', OrderSchema);
