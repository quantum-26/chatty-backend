import bcrypt from 'bcrypt';
import usersModel from "../Model/userModel.js";

var userServices = {}

userServices.registerUser = async(messageObj)=> {
    try {
        let { email, password, userName } = messageObj;
        const userModel = await usersModel();
        if (!userName) userName = email;
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        const newUser = new userModel({
            email,
            password: passwordHash,
            userName,
        });
        const savedUser = await newUser.save();
        return savedUser;
    }
    catch (err) {
        throw err;
    }
}

userServices.deleteUserById = async(id) => {
    try {
        const userModel = await usersModel();
        const userExist = await userServices.findUserById(id);
        if (!userExist) {
            const err = new Error("User not exist in system");
            err.status = 400;
            throw err;
        }

        const deleteUser = await userModel.deleteOne({ _id : id });
        if (deleteUser && deleteUser.acknowledged) {
            return deleteUser.deletedCount;
        }else{
            const err = new Error("User not able to delete properly");
            err.status = 402;
            throw err;
        }
    }
    catch(err){
        throw err;
    }
}

userServices.findUserByEmail = async(email) => {
    try {
        const userModel = await usersModel();
        const existingUser = await userModel.findOne({ email: email });
        return existingUser;
    }
    catch (err) {
        throw err;
    }
}

userServices.findUserById = async(id) => {
    try {
        const userModel = await usersModel();
        const existingUser = await userModel.findOne({ "_id": id });
        return existingUser;
    }
    catch (err) {
        throw err;
    }
}

export default userServices;