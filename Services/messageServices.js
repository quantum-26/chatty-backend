import messagesModel from "../Model/messageModel.js";

var messageServices = {}
//message object have a method postMessage
//This method interacts with DB 
//This method make use of create(mongoose method) to insert message object  
messageServices.postMessage = async(messageObj)=> {
    try {
        const messageModel = await messagesModel();
        // let response = await messageModel.insertMany(messageObj);
        const { text, receiverName, senderName} = messageObj;
        const newMessage = new messageModel({
            senderName,
            receiverName,
            text,
        });
        const savedMessage = await newMessage.save();
        if (savedMessage) {
            return savedMessage;
        } else {
            let err = new Error("Script insertion failed")
            err.status = 500
            throw new Error
        }
    }
    catch (err) {
        console.log(err.message);
    }
}

//message object have a method getMessage
//This method interacts with DB and fetch message object  
messageServices.getMessages = async()=> {
    try {
        const messageModel = await messagesModel();
        let response = await messageModel.find({}, {_id: 1, senderName : 1, receiverName : 1, text: 1});
        if (response) {
            return response;
        } else {
            let err = new Error("Script insertion failed")
            err.status = 500
            throw new Error
        }
    }
    catch (err) {
        console.log(err.message);
    }
}

export default messageServices;