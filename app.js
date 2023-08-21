import express from 'express';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import { ErrorHandler, errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routers/user.js";
import postRouter from "./routers/post.js";
import cors from "cors";
config();
export const app = express();
app.use(cors({
    methods: ["GET", "POST", "DELETE", "PUT"],
    origin: 'http://localhost:5173', // Update with your frontend's origin
    credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);

app.all("*", (req, res, next) => {
    return next(new ErrorHandler("Unknown command", 400));
});

app.use(errorMiddleware);
