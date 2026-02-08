import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
  _id: mongoose.Types.ObjectId;
  postId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    postId: {
      type: String,
      required: true,
      ref: "Post",
    },
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
commentSchema.index({ postId: 1, createdAt: -1 });

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
