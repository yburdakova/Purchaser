import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {  
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    forAdmin:{
      type: Boolean,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    isRead: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      enum: ['customerRequest', 'newOrder', 'newProduct', 'priceChange', 'statusChange', 'orderStatusChange'],
      required: true
    },
    data: mongoose.Schema.Types.Mixed
  },
  {
    timestamps: true
  }

);

export const Notification = mongoose.model('Notification', notificationSchema);