import usersProfileModel from "../Model/userProfileModel.js"


var userProfileServices = {}

userProfileServices.setAvatar = async(userName, userId, avatarImage) => {
    try {
        const userProfileModel = await usersProfileModel();
        const userProfile = new userProfileModel({
            userName,
            userId,
            isAvatarImageSet: true,
            avatarImage,
        });
        const savedUserProfile = await userProfile.save();
        return savedUserProfile;
    }catch (err) {
        throw err;
    }
}

userProfileServices.updateAvatar = async(userId, avatarImage) => {
    try {
        const userProfileModel = await usersProfileModel();
        const userData = await userProfileModel.findByIdAndUpdate(
            userId,
            {
              isAvatarImageSet: true,
              avatarImage,
            },
            { new: true }
        );

        return userData;
    }catch (err) {
        throw err;
    }
}

userProfileServices.getUserProfileById = async(userId) => {
    try {
        const userProfileModel = await usersProfileModel();
        const existingUser = await userProfileModel.findOne({ userId: userId });
        return existingUser;
    }catch (err) {
        throw err;
    }
}

userProfileServices.getUserProfileNotEqId = async(userId) => {
    try {
        const userProfileModel = await usersProfileModel();
        const users = await userProfileModel.find({ userId: { $ne: userId } }).select([
            "userName",
            "avatarImage",
            "_id",
          ]);
        return users;
    }catch (err) {
        throw err;
    }
}

export default userProfileServices;