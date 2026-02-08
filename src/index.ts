import dotenv from "dotenv";
import express, { Request, Response } from "express";
import authRoutes from "./routes/auth";
import notificationsRoutes from "./routes/notifications";
import postsRoutes from "./routes/posts";
import { connectToDatabase } from "./utils/database";
import { initializeFirebase } from "./utils/firebase";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
const corsOrigin = process.env.CORS_ORIGIN || "*";
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", corsOrigin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH",
  );
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Social Feed API is running",
    version: "1.0.0",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/notifications", notificationsRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

async function start() {
  try {
    // Initialize database
    await connectToDatabase();

    // Initialize Firebase
    await initializeFirebase();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log("API Documentation:");
      console.log("  POST   /api/auth/signup - Create new user");
      console.log("  POST   /api/auth/login - User login");
      console.log("  POST   /api/posts - Create post (auth required)");
      console.log("  GET    /api/posts - Get all posts (paginated)");
      console.log("  GET    /api/posts/:id - Get specific post");
      console.log(
        "  POST   /api/posts/:id/like - Like/unlike post (auth required)",
      );
      console.log(
        "  POST   /api/posts/:id/comment - Add comment (auth required)",
      );
      console.log("  GET    /api/posts/:id/comments - Get post comments");
      console.log("  GET    /api/posts/:id/likes - Get post likes");
      console.log(
        "  POST   /api/notifications/register-token - Register FCM token (auth required)",
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();

export default app;
