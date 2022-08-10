import connection from "../Utilities/Connection.js";
import usersSchema from "../Schemas/userSchema.js";

const usersModel = async() => {
    try {
       return (await connection.model("Users", usersSchema));
    } catch (err) {
        let error = new Error("Could not connect to database")
        error.status = 500
        throw error
    }
}

export default usersModel;