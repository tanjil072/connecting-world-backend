import { Router } from "express";
import {
  commentOnPost,
  getComments,
  getLikes,
  likePost,
} from "../controllers/interactionsController";
import {
  createPost,
  getPostById,
  getPosts,
} from "../controllers/postsController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Posts
router.post("/", authMiddleware, createPost);
router.get("/", authMiddleware, getPosts);
router.get("/:id", authMiddleware, getPostById);

// Likes
router.post("/:id/like", authMiddleware, likePost);
router.get("/:id/likes", getLikes);

// Comments
router.post("/:id/comment", authMiddleware, commentOnPost);
router.get("/:id/comments", getComments);

export default router;
