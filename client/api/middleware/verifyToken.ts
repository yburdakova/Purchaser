import { VercelRequest } from "@vercel/node";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
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


export const verifyTokenAndAdmin = async (req: VercelRequest): Promise<{ success: boolean; status?: number; message?: string }> => {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
        return { success: false, status: 401, message: "You are not authenticated!" };
    }

    const token = authHeader.substring(7, authHeader.length);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;

        if (!decoded.isAdmin) {
            return { success: false, status: 403, message: "You are not allowed to do that!" };
        }

        return { success: true };
    } catch (error) {
        return { success: false, status: 403, message: "Token is not valid!" };
    }
};
