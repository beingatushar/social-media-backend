import express from 'express';
import { config } from 'dotenv';
import cors from "cors";
import cookieParser from 'cookie-parser';
import { ErrorHandler, errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routers/user.js";
import postRouter from "./routers/post.js";

// Load environment variables
config();

// Create Express app
export const app = express();

// Enable CORS
app.use(cors({
    origin: 'http://localhost:5173', // Update with your frontend's origin
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
    // sameSite: 'none', // Set to 'none' for cross-site cookies
}));

// Set headers
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Credentials', true);
//     next();
// });

// Parse URL-encoded and JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Mount routers
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);

// Handle unknown routes
app.all("*", (req, res, next) => {
    return next(new ErrorHandler("Unknown command", 400));
});

// Error handling middleware
app.use(errorMiddleware);

export default app;
