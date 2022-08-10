import mongoose from "mongoose";

const userSchema = {
    userName: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 50,
    },
    password: {
        type: String,
        required: true,
    },
};

const  usersSchema = await mongoose.Schema(userSchema , { collection: 'Users', timestamps: true });

export default usersSchema;