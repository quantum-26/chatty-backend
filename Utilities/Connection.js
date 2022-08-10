import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.MONGODB_URL || "mongodb+srv://chatty-backend:chatty-backend@chatty.qwyu8v6.mongodb.net/?retryWrites=true&w=majority";
console.log('mongo url');
console.log(url);
const connection = await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
export default connection;
