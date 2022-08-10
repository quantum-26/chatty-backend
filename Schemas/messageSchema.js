import mongoose from "mongoose";

const messageSchema = {
    text: {
        type: String,
        required: true,
    },
    senderName: {
        type: String,
        required: true,
    },
    receiverName: {
        type: String,
        required: true,
    },
};

const  messagesSchema = await mongoose.Schema(messageSchema , { collection: 'Messages', timestamps: true });

export default messagesSchema;