import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { categoryRouter } from './routes/index.js';

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
    console.log('Backend server is running');
});

app.use("/api/categories", categoryRouter)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});