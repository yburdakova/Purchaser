import express from "express";
import { CustomerRequest } from "../models/CustomerRequest.js";
import { verifyTokenAndAdmin } from "../middleware/verifyToken.js";
const router = express.Router();

//NEW CUSTOMER REQUEST
router.post("/send_request", async (req, res) => {
    const newRequest = new CustomerRequest({
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone
    });

    try {
        const savedRequest = await newRequest.save();
        res.status(201).json(savedRequest);
    } catch (err) {
        res.status(500).json(err);
    }
});





export default router;