import express from "express";
import { User } from '../models/User.js';
import { CustomerRequest } from "../models/CustomerRequest.js";
import { verifyTokenAndAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

// NEW CUSTOMER REQUEST
router.post("/new_request", async (req, res) => {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
        return res.status(200).json({ 
            existingUser: true, 
            message: "User already exists" 
        });
    }
    const newRequest = new CustomerRequest({
        title: req.body.title,
        email: req.body.email,
        contactName: req.body.contactName,
        contactPhone: req.body.contactPhone,
        type: "newUser"
    });
    try {
        const savedRequest = await newRequest.save();
        res.status(201).json(savedRequest);
    } catch (err) {
        console.error("Error in send_request:", err);
        res.status(500).json(err);
    }
});

// PASSWORD REQUEST
router.post("/password_request", async (req, res) => {
    const existingUser = await User.findOne({ email: req.body.email });

    if (!existingUser) {
        return res.status(200).json({ 
            existingUser: false, 
            message: "User does not exist" 
        });
    } 

    const newRequest = new CustomerRequest({
        title: existingUser.title,
        email: req.body.email,
        contactName: req.body.contactName,
        contactPhone: req.body.contactPhone,
        type: "newPassword",
        data: { relatedId: existingUser._id }
    });

    try {
        const savedRequest = await newRequest.save();
        res.status(201).json({
            existingUser: true,
            request: savedRequest
        });
    } catch (err) {
        console.error("Error in send_request:", err);
        res.status(500).json(err);
    }
});

// SET NEW REQUEST TYPE
router.patch("/update-request/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const request = await CustomerRequest.findById(req.params.id);
        if (request) {
            request.type = req.body.type; 
            await request.save();
            res.status(200).json(request);
        } else {
            res.status(404).json({ message: "Request not found" });
        }
    } catch (error) {
        res.status(500).json(error); 
    }
});

//GET ALL REQUESTS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
    const customerRequests = query
        ? await CustomerRequest.find().sort({ _id: -1 }).limit(5)
        : await CustomerRequest.find();
    res.status(200).json(customerRequests);
    } catch (err) {
    res.status(500).json(err);
    }
});

//DELETE REQUEST
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await CustomerRequest.findByIdAndDelete(req.params.id);
        res.status(200).json("Request has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

// SET NOTIFICATION IS READ
router.patch("/update_request/:id", verifyTokenAndAdmin, async (req, res) => {
    const requestId = req.params.id; 
    try {
        const updatedRequest = await CustomerRequest.findByIdAndUpdate(
            requestId,
            { $set: { isProcessed: true } },
            { new: true }
        );
        res.status(200).json(updatedRequest);
    } catch (err) {
        res.status(500).json(err);
    }
});

export default router;