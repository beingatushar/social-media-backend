# Social Media Backend App

This repository contains the backend application for a social media platform. It provides a set of APIs to manage user authentication, user profiles, posts, likes, and comments. The application is built using Node.js and Express.js, and it interacts with a MongoDB database using Mongoose.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Connection](#database-connection)
- [Utils](#utils)
- [Middlewares](#middlewares)
- [Routers](#routers)
- [Error Handling](#error-handling)
- [Running the Application](#running-the-application)
- [Contributing](#contributing)
- [License](#license)

## Features

- User registration and login with hashed passwords
- User authentication using JSON Web Tokens (JWT)
- User profiles with follow/unfollow functionality
- Create, update, and delete posts
- Like/unlike posts
- Add and delete comments on posts
- Comprehensive error handling and middleware support
- CORS configuration for cross-origin requests

## Project Structure

The project is organized with the following structure:

- `middlewares`: Contains custom middleware functions.
- `models`: Defines Mongoose schemas for MongoDB.
- `routers`: Defines route handlers for various endpoints.
- `utils`: Contains utility functions.
- `app.js`: The main Express application file.

## Getting Started

Follow these steps to set up and run the application:

1. Clone the repository: `git clone https://github.com/beingatushar/social-media-backend.git`
2. Install dependencies: `npm install`
3. Set up environment variables (see [Environment Variables](#environment-variables))
4. Run the application: `npm start`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

- `PORT`: Port number for the server to listen on
- `MONGO_URI`: MongoDB database URI
- `JWT_SECRET`: Secret key for JWT signing
- `BCRYPT_ROUNDS`: Number of bcrypt rounds for password hashing

## Database Connection

The `connectDB` function in `utils/db.js` establishes a connection to the MongoDB database using Mongoose. It uses the provided `MONGO_URI` from the environment variables.

## Utils

The `utils` directory contains utility functions:

- `features.js`: Defines the `sendResponse` function for sending standardized API responses.
- `auth.js`: Contains functions for managing user authentication and cookies.

## Middlewares

- `auth.js`: Defines middleware functions for user authentication and cookie management.
- `error.js`: Contains the `ErrorHandler` class for standardized error handling, and the `catchAsyncError` and `errorMiddleware` functions.

## Routers

- `user.js`: Defines user-related routes and handlers.
- `post.js`: Defines post-related routes and handlers.

## Error Handling

The application uses a custom `ErrorHandler` class to create standardized error objects. The `errorMiddleware` middleware function catches errors and sends appropriate error responses using the `sendResponse` function.

## Running the Application

Run the application using the command: `npm start`

The server will start running on the specified port, and you can access the APIs using the provided endpoints.

## Contributing

Contributions to this project are welcome! Feel free to submit issues and pull requests.

## License

This project is licensed under the [MIT License](LICENSE).

---

## API Endpoints

### User Endpoints

#### `POST /api/v1/user/register`

Register a new user.

**Data:** `username`, `email`, `password`

**Output:** User registration data with a JWT token.

#### `POST /api/v1/user/login`

Log in an existing user.

**Data:** `email` or `username`, `password`

**Output:** User login data with a JWT token.

#### `GET /api/v1/user/me`

Get the profile of the authenticated user.

**Output:** User profile data.

#### `GET /api/v1/user/logout`

Log out the authenticated user.

**Output:** Empty response.

#### `POST /api/v1/user/:userId/follow`

Follow another user.

**Data:** `userId`

**Output:** Success message.

#### `POST /api/v1/user/:userId/unfollow`

Unfollow a followed user.

**Data:** `userId`

**Output:** Success message.

### Post Endpoints

#### `POST /api/v1/post`

Create a new post.

**Data:** `image`, `content`

**Output:** Created post data.

#### `GET /api/v1/post/:id`

Get a post by its ID.

**Output:** Post data.

#### `PUT /api/v1/post/:id`

Update a post by its ID.

**Data:** `image`, `content`

**Output:** Updated post data.

#### `DELETE /api/v1/post/:id`

Delete a post by its ID.

**Output:** Deleted post data.

#### `POST /api/v1/post/:id/like`

Toggle like on a post.

**Output:** Success message.

#### `POST /api/v1/post/:id/comment`

Add a comment to a post.

**Data:** `text`

**Output:** Success message.

#### `DELETE /api/v1/post/:id/comment/:commentId`

Delete a comment from a post.

**Output:** Success message.
