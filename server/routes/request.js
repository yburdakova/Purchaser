import express from "express";
import { CustomerRequest } from "../models/CustomerRequest.js";
import { verifyTokenAndAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

// CUSTOMER REQUEST
router.post("/send_request", async (req, res) => {
    const newRequest = new CustomerRequest({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
    });
    try {
        const savedRequest = await newRequest.save();
        res.status(201).json(savedRequest);
    } catch (err) {
        console.error("Error in send_request:", err);
        res.status(500).json(err);
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