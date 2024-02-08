import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.log("Token is not valid!"); 
                return res.status(403).json("Token is not valid!"); 
            }
            req.user = user;
            next();
        });
    } else {
        console.log('You are not authenticated!');
        return res.status(401).json("You are not authenticated!"); 
    }
};

export const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
    if (req.user.id === req.params.userId || req.user.isAdmin) {
        next();
    } else {
        console.log('You are not allowed to do that!');
        res.status(403).json("You are not allowed to do that!");
    }
    });
};

export const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
    if (req.user.isAdmin) {
        next();
    } else {
        console.log('You are not allowed to do that!');
        res.status(403).json("You are not allowed to do that!");
    }
    });
};
