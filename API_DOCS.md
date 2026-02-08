# Connecting World API Documentation

## 📚 Overview

This is the API documentation for the Connecting World social app backend. The API provides endpoints for user authentication, post management, interactions (likes and comments), and push notifications.

**Base URL**: `http://localhost:3000/api` (Development)  
**Production URL**: `https://api.your-app-domain.com/api`

**API Version**: 1.0.0  
**Last Updated**: February 2026

---

## 🔐 Authentication

### JWT Bearer Token

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

**Token Expiration**: 7 days

---

## 📋 API Endpoints

### 1. Authentication Routes

#### **POST /api/auth/signup**

Create a new user account.

**Request Body:**

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Required Fields:**

- `username` (string, 3+ chars, unique)
- `email` (string, unique)
- `password` (string)

**Response (201 Created):**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

- `400` - Missing required fields or user already exists
- `500` - Server error

**Status Codes:**

- `201` - Account created successfully
- `400` - Validation failed
- `500` - Server error

---

#### **POST /api/auth/login**

Authenticate user and receive JWT token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Required Fields:**

- `email` (string)
- `password` (string)

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

- `400` - Missing email or password
- `401` - Invalid email or password
- `500` - Server error

**Status Codes:**

- `200` - Login successful
- `400` - Missing fields
- `401` - Invalid credentials
- `500` - Server error

---

### 2. Posts Routes

#### **POST /api/posts**

Create a new post.

**Authentication Required**: Yes  
**Headers**: `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "content": "This is my first post!"
}
```

**Required Fields:**

- `content` (string, non-empty)

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439010",
    "username": "john_doe",
    "content": "This is my first post!",
    "createdAt": "2026-02-08T10:30:00.000Z",
    "likesCount": 0,
    "commentsCount": 0
  }
}
```

**Error Responses:**

- `400` - Missing or empty content
- `401` - Unauthorized (missing token)
- `500` - Server error

---

#### **GET /api/posts**

Get paginated posts with optional filtering.

**Authentication Required**: Yes  
**Headers**: `Authorization: Bearer <token>`

**Query Parameters:**

- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Posts per page
- `username` (string, optional) - Filter posts by username

**Examples:**

```
GET /api/posts
GET /api/posts?page=2&limit=20
GET /api/posts?username=john_doe
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Posts retrieved successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439010",
      "username": "john_doe",
      "content": "Hello world!",
      "createdAt": "2026-02-08T10:30:00.000Z",
      "likesCount": 5,
      "commentsCount": 2
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439010",
      "username": "john_doe",
      "content": "Second post",
      "createdAt": "2026-02-08T11:00:00.000Z",
      "likesCount": 3,
      "commentsCount": 1
    }
  ],
  "pagination": {
    "currentPage": 1,
    "limit": 10,
    "totalPages": 5,
    "totalPosts": 42
  }
}
```

**Error Responses:**

- `401` - Unauthorized
- `500` - Server error

---

#### **GET /api/posts/:id**

Get a specific post by ID.

**Authentication Required**: Yes  
**Headers**: `Authorization: Bearer <token>`

**URL Parameters:**

- `id` (string) - Post ID

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Post retrieved successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439010",
    "username": "john_doe",
    "content": "Hello world!",
    "createdAt": "2026-02-08T10:30:00.000Z",
    "likesCount": 5,
    "commentsCount": 2
  }
}
```

**Error Responses:**

- `401` - Unauthorized
- `404` - Post not found
- `500` - Server error

---

### 3. Likes Routes

#### **POST /api/posts/:id/like**

Like or unlike a post.

**Authentication Required**: Yes  
**Headers**: `Authorization: Bearer <token>`

**URL Parameters:**

- `id` (string) - Post ID

**Request Body:**

```json
{}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Post liked successfully",
  "data": {
    "likesCount": 6
  }
}
```

**Error Responses:**

- `401` - Unauthorized
- `404` - Post not found
- `500` - Server error

---

#### **GET /api/posts/:id/likes**

Get all users who liked a post.

**Authentication Required**: No

**URL Parameters:**

- `id` (string) - Post ID

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Likes retrieved successfully",
  "data": [
    {
      "userId": "507f1f77bcf86cd799439001",
      "username": "alice"
    },
    {
      "userId": "507f1f77bcf86cd799439002",
      "username": "bob"
    }
  ]
}
```

**Error Responses:**

- `404` - Post not found
- `500` - Server error

---

### 4. Comments Routes

#### **POST /api/posts/:id/comment**

Add a comment to a post.

**Authentication Required**: Yes  
**Headers**: `Authorization: Bearer <token>`

**URL Parameters:**

- `id` (string) - Post ID

**Request Body:**

```json
{
  "text": "Great post!"
}
```

**Required Fields:**

- `text` (string, non-empty)

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Comment added successfully",
  "data": {
    "id": "507f1f77bcf86cd799439050",
    "postId": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439010",
    "username": "john_doe",
    "text": "Great post!",
    "createdAt": "2026-02-08T10:35:00.000Z"
  }
}
```

**Error Responses:**

- `400` - Missing or empty text
- `401` - Unauthorized
- `404` - Post not found
- `500` - Server error

---

#### **GET /api/posts/:id/comments**

Get all comments on a post.

**Authentication Required**: No

**URL Parameters:**

- `id` (string) - Post ID

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 20)

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Comments retrieved successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439050",
      "postId": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439010",
      "username": "john_doe",
      "text": "Great post!",
      "createdAt": "2026-02-08T10:35:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "limit": 20,
    "totalComments": 1
  }
}
```

**Error Responses:**

- `404` - Post not found
- `500` - Server error

---

### 5. Notifications Routes

#### **POST /api/notifications/register-token**

Register Firebase Cloud Messaging (FCM) token for push notifications.

**Authentication Required**: Yes  
**Headers**: `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "token": "cDhlbXp0ZWZzZWZzZWZzZWZzZWZzZWZz..."
}
```

**Required Fields:**

- `token` (string) - FCM token from Firebase

**Response (200 OK):**

```json
{
  "success": true,
  "message": "FCM token registered successfully"
}
```

**Error Responses:**

- `400` - Missing token
- `401` - Unauthorized
- `500` - Server error

---

#### **POST /api/notifications/send**

Send a notification to a user (Admin/Testing endpoint).

**Authentication Required**: Yes  
**Headers**: `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "userId": "507f1f77bcf86cd799439010",
  "title": "New Like",
  "body": "Someone liked your post!"
}
```

**Required Fields:**

- `userId` (string)
- `title` (string)
- `body` (string)

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Notification sent successfully"
}
```

**Error Responses:**

- `400` - Missing required fields
- `401` - Unauthorized
- `500` - Server error

---

#### **GET /api/notifications**

Get notifications for the current user.

**Authentication Required**: Yes  
**Headers**: `Authorization: Bearer <token>`

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 10)

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Notifications retrieved successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439060",
      "userId": "507f1f77bcf86cd799439010",
      "title": "New Like",
      "body": "Someone liked your post!",
      "read": false,
      "createdAt": "2026-02-08T10:40:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "limit": 10,
    "totalNotifications": 1
  }
}
```

**Error Responses:**

- `401` - Unauthorized
- `500` - Server error

---

## 🔄 Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    /* response data */
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": "Error details (development only)"
}
```

---

## ⚠️ Error Codes

| Code | Description                                      |
| ---- | ------------------------------------------------ |
| 200  | OK - Request successful                          |
| 201  | Created - Resource created successfully          |
| 400  | Bad Request - Invalid input or missing fields    |
| 401  | Unauthorized - Missing or invalid authentication |
| 404  | Not Found - Resource not found                   |
| 500  | Internal Server Error - Server-side error        |

---

## 🔒 Security Considerations

1. **JWT Tokens**: Always include in Authorization header
2. **HTTPS**: Use HTTPS in production
3. **Rate Limiting**: Implement in production (currently not enforced)
4. **Input Validation**: All inputs are validated server-side
5. **Password**: Passwords are hashed with bcrypt (10 rounds)
6. **CORS**: Configured per environment

---

## 💾 Data Models

### User

```json
{
  "_id": "507f1f77bcf86cd799439010",
  "username": "john_doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "createdAt": "2026-02-08T10:00:00.000Z"
}
```

### Post

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439010",
  "username": "john_doe",
  "content": "Hello world!",
  "createdAt": "2026-02-08T10:30:00.000Z",
  "updatedAt": "2026-02-08T10:30:00.000Z"
}
```

### Like

```json
{
  "_id": "507f1f77bcf86cd799439020",
  "postId": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439001",
  "username": "alice",
  "createdAt": "2026-02-08T10:35:00.000Z"
}
```

### Comment

```json
{
  "_id": "507f1f77bcf86cd799439050",
  "postId": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439010",
  "username": "john_doe",
  "text": "Great post!",
  "createdAt": "2026-02-08T10:35:00.000Z"
}
```

### Notification

```json
{
  "_id": "507f1f77bcf86cd799439060",
  "userId": "507f1f77bcf86cd799439010",
  "title": "New Like",
  "body": "Someone liked your post!",
  "read": false,
  "createdAt": "2026-02-08T10:40:00.000Z"
}
```

---

## 📝 Examples

### Example: Sign Up and Get Token

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Example: Create a Post

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "content": "Hello world!"
  }'
```

### Example: Get Posts

```bash
curl -X GET "http://localhost:3000/api/posts?page=1&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Example: Like a Post

```bash
curl -X POST http://localhost:3000/api/posts/507f1f77bcf86cd799439011/like \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🚀 Development Notes

- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Environment**: Check `.env` for configuration

---

## 📞 Support

For issues or questions about the API:

1. Check `.env.example` for configuration
2. Review logs in the terminal
3. Ensure MongoDB is running
4. Verify JWT_SECRET is set in `.env`

---

**Last Updated**: February 8, 2026
