import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { 
    authRouter, 
    categoryRouter, 
    userRouter,
    productRouter,
    requestRouter,
    notifyRouter 
} from './routes/index.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

mongoose
    .connect(process.env.MONGO_URL)
    .then(()=>{
        console.log('Mongo DB is connected successfully');
    })
    .catch(err => {
        console.log(err.message);
    });

app.listen(process.env.PORT || 5000, ()=> {
    console.log('Backend server is running on 5000 port');
});

app.use("/api/categories", categoryRouter)
app.use("/api/users", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/products", productRouter)
app.use("/api/requests", requestRouter)
app.use("/api/notifications", notifyRouter)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});