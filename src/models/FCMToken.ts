import mongoose, { Document, Schema } from "mongoose";

export interface IFCMToken extends Document {
  userId: string;
  token: string;
  createdAt: Date;
}

const fcmTokenSchema = new Schema<IFCMToken>(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
fcmTokenSchema.index({ userId: 1 });

export const FCMToken = mongoose.model<IFCMToken>("FCMToken", fcmTokenSchema);
