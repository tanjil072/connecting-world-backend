import mongoose, { Document, Schema } from "mongoose";

export interface ILike extends Document {
  _id: mongoose.Types.ObjectId;
  postId: string;
  userId: string;
  username: string;
  createdAt: Date;
}

const likeSchema = new Schema<ILike>(
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
  },
  {
    timestamps: true,
  },
);

// Compound unique index to prevent duplicate likes
likeSchema.index({ postId: 1, userId: 1 }, { unique: true });

export const Like = mongoose.model<ILike>("Like", likeSchema);
