# OneMinuteQuiz Backend

OneMinuteQuiz Backend is a production-ready Node.js API built with TypeScript and Express, designed to support my quiz application with secure user authentication, feedback management, and admin analytics.

## Project Overview

This backend provides:
- User registration and login with hashed passwords using `bcryptjs`
- JWT-based session management stored in HTTP-only cookies
- Role-based user support for standard users and admins
- Feedback submission, storage, and rating aggregation
- User and feedback administration endpoints for dashboards
- Centralized error handling and async middleware for cleaner code paths

## Tech Stack

- Node.js
- TypeScript
- Express
- MongoDB with Mongoose
- JWT authentication
- `cors`, `dotenv`, `cookie-parser`
- `nodemon`, `ts-node`, `typescript` for development


## Key Features

- Strong typed backend using TypeScript interfaces and models
- Secure password hashing and JWT token generation
- Cookie-based authentication with protected routes
- Feedback creation and validation with rating support
- Admin dashboard endpoints for user and feedback overview
- Delete user and delete feedback operations for admin control
- Central validation for required environment variables


## Environment Variables

Required:
- `JWT_SECRET` — Secret key for JWT token signing
- `MONGODB_CONNECTION_STRING_URI` — MongoDB connection URI

Optional:
- `PORT` — Application port (default: `3000`)
- `JWT_EXPIRATION` — Token expiration (default: `1h`)
- `NODE_ENV` — Environment mode
- `ADMIN_CREATION_SECRET` — Secret used for admin registration

## Run Locally

1. Install dependencies
   ```bash
   npm install
   ```
2. Create a `.env` file and set the required variables
3. Start the development server
   ```bash
   npm run dev
   ```
4. Build for production
   ```bash
   npm run build
   npm start
   ```
