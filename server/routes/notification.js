import express from 'express';
import { Notification } from '../models/Notification.js';
import { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post("/add_notification", async (req, res) => {

  const newNotification = new Notification({
      toUser: req.body.toUser,
      fromUser: req.body.fromUser,
      type: req.body.type,
      forAdmin: req.body.forAdmin,
      message: req.body.message,
      data: req.body.data
  });
  try {
      const savedNotification = await newNotification.save();
      res.status(201).json(savedNotification);
  } catch (err) {
      res.status(500).json(err);
  }
});

// GET ADMIN'S NOTIFICATIONS
router.get("/admin_notifications", verifyTokenAndAdmin, async (req, res) => {
  try {
    const notifications = await Notification.find({ forAdmin: true }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json(err);
  }
});

// SET NOTIFICATION IS READ
router.patch("/update_notification/:notificationId", verifyToken, async (req, res) => {
  const notificationId = req.params.notificationId;
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { $set: { isRead: true } },
      { new: true }
    );
    res.status(200).json(updatedNotification);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER'S NOTIFICATIONS
router.get("/user_notifications/:userId", verifyTokenAndAuthorization, async (req, res) => {
  const userId = req.params.userId;
  try {
    const notifications = await Notification.find({ toUser: userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL USER NOTIFICATIONS
router.get("/user_notifications", async (req, res) => {
  try {
    const notifications = await Notification.find({ toUser: null, forAdmin:false}).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;

