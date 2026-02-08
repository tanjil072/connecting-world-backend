import * as admin from "firebase-admin";
import * as path from "path";
import { FCMToken, Notification } from "../models";

let isFirebaseInitialized = false;

export async function initializeFirebase() {
  try {
    if (isFirebaseInitialized) return;

    // Initialize Firebase Admin SDK with service account file
    const serviceAccountPath = path.join(
      __dirname,
      "../../../connectingworld-76bdc-firebase-adminsdk-fbsvc-2a53a95763.json",
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
    });

    console.log("Firebase initialized successfully");
    isFirebaseInitialized = true;
  } catch (error) {
    console.error("Firebase initialization error:", error);
    throw error;
  }
}

export async function registerFCMToken(userId: string, token: string) {
  try {
    console.log(`Attempting to register FCM token for user ${userId}`);
    console.log(`Token: ${token.substring(0, 20)}...`);

    // Check if token already exists
    const existingToken = await FCMToken.findOne({ token });

    if (existingToken) {
      // Update userId if different
      if (existingToken.userId !== userId) {
        existingToken.userId = userId;
        await existingToken.save();
        console.log(`Updated FCM token for user ${userId}`);
      } else {
        console.log(`FCM token already exists for user ${userId}`);
      }
      return;
    }

    // Create new token
    const newToken = await FCMToken.create({ userId, token });
    console.log(`✅ Successfully registered new FCM token for user ${userId}`);
    console.log(`Token ID: ${newToken._id}`);

    // Verify the token was saved
    const verifyToken = await FCMToken.findOne({ userId, token });
    console.log(`Verification: Token found = ${!!verifyToken}`);
  } catch (error) {
    console.error("❌ Error registering FCM token:", error);
    throw error;
  }
}

export async function sendNotification(
  userId: string,
  title: string,
  body: string,
  data?: Record<string, string>,
) {
  try {
    // Save notification to database first
    const notificationType = data?.type as
      | "like"
      | "comment"
      | "follow"
      | "other"
      | undefined;
    await Notification.create({
      userId,
      title,
      body,
      type: notificationType || "other",
      data: data || {},
      read: false,
    });
    console.log(`💾 Saved notification to database for user ${userId}`);

    console.log(`🔍 Looking for FCM tokens for user: ${userId}`);
    const tokens = await FCMToken.find({ userId }).select("token").lean();
    console.log(`Found ${tokens.length} token(s) for user ${userId}`);

    if (tokens.length === 0) {
      // Check total tokens in DB
      const totalTokens = await FCMToken.countDocuments();
      console.log(
        `⚠️ No FCM tokens found for user ${userId}. Total tokens in DB: ${totalTokens}`,
      );

      // List all tokens for debugging
      const allTokens = await FCMToken.find().select("userId token").lean();
      console.log(
        "All tokens in DB:",
        allTokens.map((t) => ({
          userId: t.userId,
          token: t.token.substring(0, 20) + "...",
        })),
      );
      return;
    }

    // Send to all user tokens
    const messages = tokens.map(({ token }) => ({
      notification: { title, body },
      data: data || {},
      token: token,
    }));

    const results = await admin.messaging().sendEach(messages);
    console.log(`Sent ${results.successCount} notifications to user ${userId}`);

    // Remove invalid tokens
    results.responses.forEach((result, index) => {
      if (result.error) {
        console.error(`Error sending to token: ${result.error.message}`);
        FCMToken.deleteOne({ token: tokens[index].token }).catch(console.error);
      }
    });
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}
