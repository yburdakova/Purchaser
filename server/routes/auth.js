import express from "express";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken"

import { User } from "../models/User.js";

const router = express.Router();

//REGISTER
router.post("/register", async (req, res) => {
    const newUser = new User({
        title: req.body.title, 
        email: req.body.email,
        contacts: req.body.contacts,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASSWORD_SECRET
        ).toString(),
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

//LOGIN

router.post('/login', async (req, res) => {
    
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) { 
            return res.status(401).json("Wrong User Name"); 
        }

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASSWORD_SECRET
        );
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        const inputPassword = req.body.password;
        
        if (originalPassword != inputPassword) {
            return res.status(401).json("Wrong Password"); 
        }

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SECRET,
            {expiresIn: "3d"}
        );
    
        const { password, ...others } = user._doc;  
        res.status(200).json({...others, accessToken});

    } catch(err) {
        res.status(500).json(err);
    }
});



export default router;

