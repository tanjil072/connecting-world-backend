import { Request, Response } from "express";
import { Comment, Like, Post } from "../models";
import { sendNotification } from "../utils/firebase";

export async function likePost(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const username = req.user?.username;

    if (!userId || !username) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Check if post exists
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if already liked
    const existingLike = await Like.findOne({ postId: id, userId });

    if (existingLike) {
      // Unlike
      await Like.deleteOne({ _id: existingLike._id });
      const likesCount = await Like.countDocuments({ postId: id });

      return res.json({
        success: true,
        message: "Post unliked",
        data: { isLiked: false, likesCount },
      });
    } else {
      // Like
      await Like.create({
        postId: id,
        userId,
        username,
      });

      const likesCount = await Like.countDocuments({ postId: id });

      // Send notification to post owner
      if (post.userId !== userId) {
        console.log(
          `📤 Sending like notification from ${username} (${userId}) to post owner (${post.userId})`,
        );
        await sendNotification(
          post.userId,
          `${username} liked your post`,
          `${username} liked your post: "${post.content.substring(0, 50)}..."`,
          {
            type: "like",
            postId: id,
            fromUserId: userId,
            fromUsername: username,
          },
        );
      } else {
        console.log(`ℹ️ Not sending notification - user liked their own post`);
      }

      return res.status(201).json({
        success: true,
        message: "Post liked",
        data: { isLiked: true, likesCount },
      });
    }
  } catch (error) {
    console.error("Like post error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to like post",
      error: (error as any).message,
    });
  }
}

export async function commentOnPost(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user?.userId;
    const username = req.user?.username;

    if (!userId || !username || !content) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    if (content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty",
      });
    }

    // Check if post exists
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = await Comment.create({
      postId: id,
      userId,
      username,
      content,
    });

    // Send notification to post owner
    if (post.userId !== userId) {
      console.log(
        `📤 Sending comment notification from ${username} (${userId}) to post owner (${post.userId})`,
      );
      await sendNotification(
        post.userId,
        `${username} commented on your post`,
        `${username}: "${content.substring(0, 50)}..."`,
        {
          type: "comment",
          postId: id,
          fromUserId: userId,
          fromUsername: username,
        },
      );
    } else {
      console.log(
        `ℹ️ Not sending notification - user commented on their own post`,
      );
    }

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: {
        id: comment._id.toString(),
        postId: id,
        userId,
        username,
        content,
        createdAt: comment.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Comment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add comment",
      error: (error as any).message,
    });
  }
}

export async function getComments(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Check if post exists
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comments = await Comment.find({ postId: id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .select("_id postId userId username content createdAt")
      .lean();

    const formattedComments = comments.map((comment: any) => ({
      id: comment._id.toString(),
      postId: comment.postId,
      userId: comment.userId,
      username: comment.username,
      content: comment.content,
      createdAt: comment.createdAt,
    }));

    res.json({
      success: true,
      message: "Comments retrieved successfully",
      data: {
        comments: formattedComments,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
      error: (error as any).message,
    });
  }
}

export async function getLikes(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Check if post exists
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const likes = await Like.find({ postId: id })
      .sort({ createdAt: -1 })
      .select("_id userId username createdAt")
      .lean();

    const formattedLikes = likes.map((like: any) => ({
      id: like._id.toString(),
      userId: like.userId,
      username: like.username,
      createdAt: like.createdAt,
    }));

    res.json({
      success: true,
      message: "Likes retrieved successfully",
      data: { likes: formattedLikes },
    });
  } catch (error) {
    console.error("Get likes error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch likes",
      error: (error as any).message,
    });
  }
}
