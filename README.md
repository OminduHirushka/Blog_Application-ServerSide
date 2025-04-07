===Simple Blog Application===

--Overview--
The backend is an Express server with JWT authentication that provides a RESTful API for the blog application, connected to a PostgreSQL database.

--Features--
User signup and login with JWT
CRUD operations for blog posts
Protected routes with JWT middleware
PostgreSQL database integration

--Setup Instructions--
Install dependencies:
npm install express pg sequelize bcryptjs jsonwebtoken cors body-parser
npm install --save-dev nodemon

Start development server:
npm run dev

--Database--
host: YOUR_HOST,
user: YOUR_DATABASE_USER,
port: YOUR_PORT,
password: YOUR_PASSWORD,
database: YOUR_DATABASE_NAME,

--APIs--
Authentication:
POST /signup - Register new user
POST /login - User login

User:
GET /all-users - List all users (admin only)
GET /all-users/:email - Get user by email (protected)
PUT /update-user/:email - Update user (protected)
DELETE /delete-user/:email - Delete user (admin only)
GET /me - Get current user (protected)

Posts:
POST /add-post - Create post (protected)
GET /all-posts - List all posts (public)
GET /all-posts/:id - Get post by ID (public)
GET /user-posts/:email - Get user's posts (protected)
PUT /update-posts/:id - Update post (protected)
DELETE /delete-posts/:id - Delete post (protected)
