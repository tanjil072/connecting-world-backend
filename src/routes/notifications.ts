import { Request, Response, Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { Notification } from "../models";
import { registerFCMToken, sendNotification } from "../utils/firebase";

const router = Router();

// Register FCM token for push notifications
router.post(
  "/register-token",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const userId = req.user?.userId;

      if (!token || !userId) {
        return res.status(400).json({
          success: false,
          message: "Token is required",
        });
      }

      await registerFCMToken(userId, token);

      res.json({
        success: true,
        message: "FCM token registered successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to register token",
        error: (error as any).message,
      });
    }
  },
);

// Get all notifications for the user
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { page = 1, limit = 20 } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    const total = await Notification.countDocuments({ userId });
    const unreadCount = await Notification.countDocuments({
      userId,
      read: false,
    });

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
        unreadCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: (error as any).message,
    });
  }
});

// Mark notification(s) as read
router.patch("/read", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { notificationIds } = req.body; // Array of notification IDs or "all"

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (notificationIds === "all") {
      // Mark all as read
      await Notification.updateMany({ userId, read: false }, { read: true });
    } else if (Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      await Notification.updateMany(
        { _id: { $in: notificationIds }, userId },
        { read: true },
      );
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid notificationIds",
      });
    }

    res.json({
      success: true,
      message: "Notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to mark notifications as read",
      error: (error as any).message,
    });
  }
});

// Test endpoint to send notification to yourself
router.post("/test", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const username = req.user?.username;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await sendNotification(
      userId,
      "Test Notification",
      `Hello ${username}! This is a test notification.`,
      { type: "other" },
    );

    res.json({
      success: true,
      message: "Test notification sent",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send test notification",
      error: (error as any).message,
    });
  }
});

export default router;
