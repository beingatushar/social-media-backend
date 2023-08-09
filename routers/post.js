import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
    createPost,
    getPost,
    updatePost,
    deletePost,
    toggleLike,
    commentOnPost,
    deleteComment
} from "../controllers/post.js";

const router = express.Router();

router.post("/", isAuthenticated, createPost); // Create a new post
router.get("/:id", getPost); // Get post by ID
router.put("/:id", isAuthenticated, updatePost); // Update post by ID
router.delete("/:id", isAuthenticated, deletePost); // Delete post by ID

router.post("/:id/like", isAuthenticated, toggleLike); // User likes/unlikes a post
router.post("/:id/comment", isAuthenticated, commentOnPost); // User comments on a post
router.delete("/:id/comment/:commentId", isAuthenticated, deleteComment); // User removes their comment from a post

export default router;
