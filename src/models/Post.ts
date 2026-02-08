import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
  _id: mongoose.Types.ObjectId;
  userId: string;
  username: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    username: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
postSchema.index({ userId: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });

export const Post = mongoose.model<IPost>("Post", postSchema);
