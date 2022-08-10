import mongoose from "mongoose";

const userProfileSchema = {
    userName: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true,
    },
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    isAvatarImageSet: {
        type: Boolean,
        default: false,
    },
    avatarImage: {
        type: String,
        default: "",
    },
};

const  usersProfileSchema = await mongoose.Schema(userProfileSchema , { collection: 'UsersProfile', timestamps: true });

export default usersProfileSchema;