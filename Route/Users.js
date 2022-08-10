import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserValidator from '../Utilities/userValidation.js';
import auth from '../Middleware/auth.js';
import userServices from '../Services/usersServices.js';
import dotenv from 'dotenv';
import userProfileServices from '../Services/usersProfileService.js';
dotenv.config();

const userRouter = express.Router();
// Register
userRouter.post("/register", async (req, res) => {
    try {
        let { email, password, passwordCheck } = req.body;
        // validate user information coming from client side
        const infoValidation = UserValidator(email, password, passwordCheck);
        if (!infoValidation.valid) {
            return res.status(200).json({
                success: false, 
                message: infoValidation.message
            })
        }

        const user = await userServices.findUserByEmail(email);

        if (user){
            return res.status(200).json({
                success: false, 
                message: "An account with this email already exists."
            })
        }

        const newUser = await userServices.registerUser(req.body);
        const token = jwt.sign({ id: newUser._id.toString() }, process.env.JWT_SECRET,{
            expiresIn: process.env.JWT_EXPIRATION_TIME,
        });

        res.status(200).json({
            success: true,
            token,
            user: {
                id: newUser._id,
                userName: newUser.userName,
                hasAvatar: false,
            },
            message: "User Create successfully",
        });
    } catch (err) {
        res.status(500).json({success: false,  error: err.message });
    }
});

// Login
userRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        // validate
        if (!email || !password)
            return res.status(200).json({
                success: false, 
                message: "Not all fields have been entered." 
            }
        );

        const user = await userServices.findUserByEmail(email);
        if (!user) {
            return res.status(200).json({
                success: false, 
                message: "No account with this email has been registered."
            })
        };

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(200).json({
                success: false, 
                message: "Invalid credentials."
            })
        };

        const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET,{
            expiresIn: process.env.JWT_EXPIRATION_TIME,
        });

        const userProfile = await userProfileServices.getUserProfileById(user._id);
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                userName: user.userName,
                hasAvatar: userProfile ? true : false,
                avatarImage: userProfile.avatarImage
            },
        });
    } catch (err) 
    {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Delete
userRouter.delete("/delete", auth, async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const deletedUser = await userServices.deleteUserById(verified.id);
        return res.status(200).json({
            success: true, 
            message: "User successfully deleted"
        })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Check if token is valid
userRouter.post("/tokenIsValid", async (req, res) => {
    try {  
        const token = req.header("x-auth-token");
        if (!token) 
        {
            return res.status(200).json({
                success: false, 
                message: "Invalid token"
            })
        };

        let verified;
        try {
            verified = jwt.verify(token, process.env.JWT_SECRET);
            if(!verified)
                return res.status(200).json({ success: false, message: "Token verification failed, authorization denied"}
            );
        } catch (err){
            return res.status(200).json({ success: false, message: err.message });
        }  

        const user = await userServices.findUserById(verified.id);
        if (!user) {
            return res.status(200).json({
                success: false, 
                message: "Invalid token"
            })
        };
        return res.status(200).json({
            success: true, 
            message: "Valid token"
        })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

userRouter.get("/", auth, async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userServices.findUserById(verified.id);
        const userProfile = await userProfileServices.getUserProfileById(verified.id);

        return res.status(200).json({
            success: true, 
            user: {
                id: user._id,
                userName: user.userName,
                hasAvatar: userProfile ? true : false,
                avatarImage: userProfile.avatarImage,
            },
        })
    }catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

userRouter.get("/allusers/:id", auth, async (req, res) => {
    try {
        const userId = req.params.id;
        const users = await userProfileServices.getUserProfileNotEqId(userId);
        return res.status(200).json({
            success: true, 
            users
        })
    }catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

userRouter.post("/setavatar/:id", auth, async (req, res) => {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    if (!userId || !avatarImage)
        return res.status(200).json({
            success: false, 
            message: "Not all fields have been entered." 
        }
    );

    if(req.user != userId ) {
        return res.status(200).json({
            success: false, 
            message: "Invalid token. Access denied",
        })
    }

    const user = await userServices.findUserById(userId);
    const userProfile = await userProfileServices.getUserProfileById(userId);
    const token = jwt.sign({ id: userId}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRATION_TIME,
    });
    if(userProfile) {
        const newUserProfile = await userProfileServices.updateAvatar(userId, avatarImage);
        return res.status(200).json({
            success: true, 
            token,
            user: {
                id: userProfile._id,
                userName: userProfile.userName,
                hasAvatar: newUserProfile.isAvatarImageSet,
                avatarImage: userProfile.avatarImage
            },
            message: "Avatar image is updated successfully",
        })
    }else{
        const newUserProfile = await userProfileServices.setAvatar(user.userName, userId, avatarImage);
        return res.status(200).json({
            success: true, 
            token,
            user: {
                id: user._id,
                userName: user.userName,
                hasAvatar: newUserProfile.isAvatarImageSet,
                avatarImage: newUserProfile.avatarImage
            },
            message: "Avatar image is set successfully",
        })
    }
});

export default userRouter;