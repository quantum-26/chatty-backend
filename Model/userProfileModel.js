import usersProfileSchema from "../Schemas/userProfileSchema.js";
import connection from "../Utilities/Connection.js";

const usersProfileModel = async() => {
    try {
       return (await connection.model("UsersProfile", usersProfileSchema));
    } catch (err) {
        let error = new Error("Could not connect to database")
        error.status = 500
        throw error
    }
}

export default usersProfileModel;