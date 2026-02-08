# Social Feed App - Backend

A lightweight Node.js/Express backend for a social media feed application with user authentication, posts, likes, comments, and Firebase Cloud Messaging notifications.

**Version**: 1.0.0  
**Database**: MongoDB  
**Authentication**: JWT (JSON Web Tokens)  
**Status**: Production Ready

## 📋 Features

- ✅ User authentication with JWT tokens (7-day expiration)
- ✅ Create, read, and manage posts
- ✅ Like/unlike posts with like counters
- ✅ Comment on posts with pagination
- ✅ Firebase Cloud Messaging for push notifications
- ✅ MongoDB database with schema validation
- ✅ Paginated feed with infinite scroll support
- ✅ Filter posts by username
- ✅ Password hashing with bcryptjs
- ✅ CORS configuration for different environments

## 📚 Quick Links

- **Full API Documentation**: See [API_DOCS.md](API_DOCS.md)
- **Environment Setup**: See [../.env.example](../.env.example) and [.env.example](.env.example)
- **Build Guide**: See [../BUILD_GUIDE.md](../BUILD_GUIDE.md)

## 🔧 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud)
- Firebase Project (for notifications)

## 📦 Installation

1. Navigate to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file from the example:

```bash
cp .env.example .env
```

4. Update `.env` with your configuration:

```env
# Server
PORT=3000
NODE_ENV=development

# Database (MongoDB)
MONGODB_URI=mongodb://localhost:27017/social-feed
# For production: mongodb+srv://user:password@cluster.mongodb.net/social-feed

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS
CORS_ORIGIN=*
# For production: https://your-app-domain.com

# Firebase
FIREBASE_PROJECT_ID=connectingworld-76bdc
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc-2a53a95763@connectingworld-76bdc.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key here\n-----END PRIVATE KEY-----\n"
```

## 🚀 Running the Server

### Development mode (with auto-reload)

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Production mode

Update `.env` values for production, then:

```bash
npm run build
NODE_ENV=production npm start
```

## 📡 API Endpoints

All endpoints are documented in [API_DOCS.md](API_DOCS.md). Quick reference:

### Authentication

- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login

### Posts

- `POST /api/posts` - Create post
- `GET /api/posts` - Get feed (paginated)
- `GET /api/posts/:id` - Get post by ID

### Interactions

- `POST /api/posts/:id/like` - Like/unlike post
- `GET /api/posts/:id/likes` - Get post likes
- `POST /api/posts/:id/comment` - Add comment
- `GET /api/posts/:id/comments` - Get comments

### Notifications

- `POST /api/notifications/register-token` - Register FCM token
- `POST /api/notifications/send` - Send notification
- `GET /api/notifications` - Get notifications

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.ts          # User signup/login logic
│   │   ├── postsController.ts         # Post CRUD operations
│   │   └── interactionsController.ts  # Likes and comments
│   ├── middleware/
│   │   └── auth.ts                    # JWT verification middleware
│   ├── models/
│   │   ├── User.ts                    # User schema
│   │   ├── Post.ts                    # Post schema
│   │   ├── Like.ts                    # Like schema
│   │   ├── Comment.ts                 # Comment schema
│   │   ├── Notification.ts            # Notification schema
│   │   ├── FCMToken.ts                # FCM token schema
│   │   └── index.ts                   # Model exports
│   ├── routes/
│   │   ├── auth.ts                    # /api/auth routes
│   │   ├── posts.ts                   # /api/posts routes
│   │   └── notifications.ts           # /api/notifications routes
│   ├── utils/
│   │   ├── database.ts                # MongoDB connection
│   │   └── firebase.ts                # Firebase utilities
│   └── index.ts                       # Express app setup
├── .env.example                       # Environment template
├── package.json                       # Dependencies
├── tsconfig.json                      # TypeScript config
├── API_DOCS.md                        # Full API documentation
└── README.md                          # This file
```

## 💾 Database Setup

### MongoDB Connection

**Development (Local)**:

```env
MONGODB_URI=mongodb://localhost:27017/social-feed
```

**Production (MongoDB Atlas)**:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/social-feed
```

### Collections/Schema

- **Users**: `_id`, `username`, `email`, `password`, `createdAt`
- **Posts**: `_id`, `userId`, `username`, `content`, `createdAt`, `updatedAt`
- **Likes**: `_id`, `postId`, `userId`, `username`, `createdAt`
- **Comments**: `_id`, `postId`, `userId`, `username`, `text`, `createdAt`
- **Notifications**: `_id`, `userId`, `title`, `body`, `read`, `createdAt`
- **FCM Tokens**: `_id`, `userId`, `token`, `createdAt`

See [API_DOCS.md](API_DOCS.md) for detailed schema information.

## 🔥 Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
2. Go to Project Settings → Service Accounts
3. Generate a new private key
4. Copy the values to your `.env`:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`

## 🔐 Security Best Practices

1. **JWT Secret**: Use a strong, random string in production

   ```bash
   openssl rand -base64 32
   ```

2. **Environment Variables**: Never commit `.env` to git

3. **CORS**: Restrict to your frontend domain in production

4. **HTTPS**: Always use HTTPS in production

5. **Password Hashing**: Bcryptjs is configured with 10 salt rounds

## 🐛 Troubleshooting

### Port already in use

```bash
# Check what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### MongoDB connection failed

- Ensure MongoDB is running locally
- For cloud: check connection string and IP whitelist in MongoDB Atlas
- Verify `MONGODB_URI` in `.env`

### JWT errors

- Check `JWT_SECRET` is set correctly in `.env`
- Verify token is included in Authorization header
- Token expires after 7 days - user needs to login again

### Firebase errors (development)

- Firebase is optional in development
- App works without it but notifications won't be sent
- Check credentials in Firebase project settings

### CORS errors

- Check `CORS_ORIGIN` in `.env`
- For development: set to `*`
- For production: set to your exact frontend domain

## 🛠️ Development Tools

### Test API endpoints:

- **Postman**: [postman.com](https://postman.com)
- **Thunder Client**: VS Code extension
- **cURL**: Command line

### Monitor MongoDB:

```bash
# Using MongoDB Compass: https://www.mongodb.com/products/compass
# Or MongoDB Atlas web interface
```

## 📊 API Response Format

All responses follow this format:

**Success**:

```json
{
  "success": true,
  "message": "Operation description",
  "data": {
    /* response payload */
  }
}
```

**Error**:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<strong-random-string>
CORS_ORIGIN=https://your-app-domain.com
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
```

### Build and Start

```bash
npm run build
NODE_ENV=production npm start
```

### Deployment Platforms

- **Heroku**: Add buildpack for Node.js
- **AWS**: EC2, Lambda, or Elastic Beanstalk
- **DigitalOcean**: App Platform or Droplets
- **Railway**: Push code directly
- **Render**: Connect GitHub repo

## 📝 Related Documentation

- [Full API Documentation](API_DOCS.md)
- [Environment Guide](../ENV_GUIDE.md)
- [Frontend Setup](../QUICK_START.md)
- [Build Guide](../BUILD_GUIDE.md)

## 📞 Support

Issues or questions?

1. Check [API_DOCS.md](API_DOCS.md) for endpoint details
2. Review logs in terminal for error messages
3. Verify `.env` configuration
4. Check MongoDB connection
5. Ensure Firebase credentials are correct

## 📄 License

MIT

---

**Last Updated**: February 2026  
**Maintainer**: Connecting World Team
