import { Request, Response } from "express";
import { Comment, Like, Post } from "../models";

export async function createPost(req: Request, res: Response) {
  try {
    const { content } = req.body;
    const userId = req.user?.userId;
    const username = req.user?.username;

    if (!content || !userId || !username) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    if (content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Post content cannot be empty",
      });
    }

    const post = await Post.create({
      userId,
      username,
      content,
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: {
        id: post._id.toString(),
        userId: post.userId,
        username: post.username,
        content: post.content,
        createdAt: post.createdAt.toISOString(),
        likesCount: 0,
        commentsCount: 0,
      },
    });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: (error as any).message,
    });
  }
}

export async function getPosts(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const username = req.query.username as string;
    const userId = req.user?.userId;

    const skip = (page - 1) * limit;
    const query = username
      ? { username: { $regex: username, $options: "i" } }
      : {};

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    // Enhance posts with likes and comments count
    const enhancedPosts = await Promise.all(
      posts.map(async (post: any) => {
        const likesCount = await Like.countDocuments({
          postId: post._id.toString(),
        });
        const commentsCount = await Comment.countDocuments({
          postId: post._id.toString(),
        });

        // Check if current user liked this post
        let isLiked = false;
        if (userId) {
          const likeDoc = await Like.findOne({
            postId: post._id.toString(),
            userId: userId,
          });
          isLiked = !!likeDoc;

          // Debug logging
          console.log("Checking like for post:", post._id.toString());
          console.log("User ID from token:", userId);
          console.log("Found like doc:", likeDoc);
          console.log("isLiked result:", isLiked);
        }

        return {
          id: post._id.toString(),
          userId: post.userId,
          username: post.username,
          content: post.content,
          createdAt: post.createdAt,
          likesCount,
          commentsCount,
          isLiked,
        };
      }),
    );

    res.json({
      success: true,
      message: "Posts retrieved successfully",
      data: {
        posts: enhancedPosts,
        page,
        limit,
        total: enhancedPosts.length,
      },
    });
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: (error as any).message,
    });
  }
}

export async function getPostById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const post = await Post.findById(id).lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Get likes and comments
    const likesCount = await Like.countDocuments({ postId: id });
    const commentsCount = await Comment.countDocuments({ postId: id });
    const isLiked = userId ? await Like.exists({ postId: id, userId }) : false;

    const comments = await Comment.find({ postId: id })
      .sort({ createdAt: -1 })
      .select("_id userId username content createdAt")
      .lean();

    const formattedComments = comments.map((comment: any) => ({
      id: comment._id.toString(),
      userId: comment.userId,
      username: comment.username,
      content: comment.content,
      createdAt: comment.createdAt,
    }));

    res.json({
      success: true,
      message: "Post retrieved successfully",
      data: {
        id: post._id.toString(),
        userId: post.userId,
        username: post.username,
        content: post.content,
        createdAt: post.createdAt,
        likesCount,
        commentsCount,
        isLiked: !!isLiked,
        comments: formattedComments,
      },
    });
  } catch (error) {
    console.error("Get post error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch post",
      error: (error as any).message,
    });
  }
}
