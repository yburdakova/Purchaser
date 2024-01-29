import express from 'express';
import { Notification } from '../models/Notification.js';
import { verifyTokenAndAuthorization } from '../middleware/verifyToken.js';
import { User } from '../models/User.js'; 

const router = express.Router();

// ADD NOTIFICATION
router.post("/add_notification", async (req, res) => {
  console.log("Request to add_notification received with body:", req.body);
  const { toUser, fromUser, title, message, type, data } = req.body;

  try {
    console.log("Attempting to add a new notification");
    if (toUser) {
      console.log("Adding notification for specific user:", toUser);
      const newNotification = new Notification({ toUser, fromUser, title, message, type, data });
      await newNotification.save();
    } else {
      console.log("Adding notification for all users or admin");
      const isAdminNotification = type === 'customerRequest' || type === 'newOrder';
      const targetUsers = await User.find({ isAdmin: isAdminNotification });

      for (const user of targetUsers) {
        console.log("Creating notification for user:", user._id);
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
    console.log("Notification added successfully");
    res.status(201).json({ message: "Notification added successfully" });
  } catch (err) {
    console.error("Error adding notification:", err);
    res.status(500).json({ message: err.message || 'Error adding notification' });
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

// UPDATE NOTIFICATION
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