import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.MONGODB_URL;
console.log('mongo url');
console.log(url);
const connection = await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
export default connection;
