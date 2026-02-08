import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/social-feed";

export async function connectToDatabase() {
  try {
    console.log(MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}

export async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("MongoDB disconnection failed:", error);
    throw error;
  }
}

// Keep for backward compatibility during migration
export async function initializeDatabase() {
  return connectToDatabase();
}

export default mongoose;
