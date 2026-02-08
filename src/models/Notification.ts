import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  userId: string;
  title: string;
  body: string;
  type: "like" | "comment" | "follow" | "other";
  data?: Record<string, string>;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "comment", "follow", "other"],
      default: "other",
    },
    data: {
      type: Map,
      of: String,
      default: {},
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
notificationSchema.index({ userId: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema,
);
