import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    if (!process.env.MONGO_URL) {
      throw new Error('MONGO_URL is not defined');
    }
    
    cached.promise = mongoose.connect(process.env.MONGO_URL).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
