import express from 'express';
import { Notification } from '../models/Notification.js';
import { verifyTokenAndAuthorization, verifyTokenAndAdmin } from '../middleware/verifyToken.js';
import { User } from '../models/User.js'; 

const router = express.Router();

// ADD NOTIFICATION
router.post("/add_notification", async (req, res) => {
  const { toUser, fromUser, title, message, type, data } = req.body;
  try {
    if (toUser) {
      const newNotification = new Notification({ toUser, fromUser, title, message, type, data });
      await newNotification.save();
    } else {
      const isAdminNotification = type === 'customerRequest' || type === 'newOrder';
      const targetUsers = await User.find({ isAdmin: isAdminNotification });

      for (const user of targetUsers) {
        const newNotification = new Notification({  
          toUser,
          fromUser,
          message,
          type,
          data
        });
        await newNotification.save();
      }
    }
    res.status(201).json({ message: "Notification added successfully" });
  } catch (err) {
    console.error("Error adding notification:", err);
    res.status(500).json({ message: err.message || 'Error adding notification' });
  }
});

// GET ADMIN'S NOTIFICATIONS
router.get("/admin_notifications", verifyTokenAndAdmin, async (req, res) => {
  try {
    const notifications = await Notification.find({ toUser: null }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json(err);
  }
});

// SET NOTIFICATION IS READ
router.patch("/update_notification/:notificationId", verifyTokenAndAuthorization, async (req, res) => {
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

// GET ALL USER'S NOTIFICATIONS
router.get("/user_notifications/:userId", verifyTokenAndAuthorization, async (req, res) => {
  const userId = req.params.userId;
  try {
    const notifications = await Notification.find({ toUser: userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;

