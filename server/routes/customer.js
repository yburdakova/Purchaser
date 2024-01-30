import express from "express";
import { Customer } from "../models/Customer.js";
import CryptoJS from "crypto-js";

import { 
    verifyTokenAndAuthorization, 
    verifyTokenAndAdmin 
} from "../middleware/verifyToken.js";

const router = express.Router();

//NEW CUSTOMER
router.post("/add_customer", verifyTokenAndAdmin, async (req, res) => {

    const newCustomer = new Customer({
        title: req.body.title,
        email: req.body.email,
        contactName: req.body.contactName,
        contactPhone: req.body.contactPhone,
        extraInfo: req.body.notes
    });

    try {
        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET ALL CUSTOMERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
    const customers = query
        ? await Customer.find().sort({ _id: -1 }).limit(5)
        : await Customer.find();
    res.status(200).json(customers);
    } catch (err) {
    res.status(500).json(err);
    }
});

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString();
    }
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            {
            $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedCustomer);
        } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Customer.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
    } catch (err) {
    res.status(500).json(err);
    }
});

//GET CUSTOMER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
    const customer = await Customer.findById(req.params.id);
    const { password, ...others } = customer._doc;
    res.status(200).json(others);
    } catch (err) {
    res.status(500).json(err);
    }
});


//GET USER STATS

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
    const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
        $project: {
            month: { $month: "$createdAt" },
        },
        },
        {
        $group: {
            _id: "$month",
            total: { $sum: 1 },
        },
        },
    ]);
    res.status(200).json(data)
    } catch (err) {
    res.status(500).json(err);
    }
});


export default router;