import connection from "../Utilities/Connection.js"
import messagesSchema from "../Schemas/messageSchema.js";

const messagesModel = async() => {
    try {
       return (await connection.model("Message", messagesSchema));
    } catch (err) {
        let error = new Error("Could not connect to database")
        error.status = 500
        throw error
    }
}

export default messagesModel;