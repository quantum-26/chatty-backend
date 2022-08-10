import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    try{
        const token = req.header("x-auth-token");
        if(!token)
            return res.status(401).json({ success: false, message: "No authentication token, access denied"}
        );
        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            if(!verified)
                return res.status(401).json({ success: false, message: "Token verification failed, authorization denied"}
            );
            req.user = verified.id;
        } catch (err){
            res.status(200).json({ success: false, message: err.message });
        }
        next();
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

export default auth;