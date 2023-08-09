import { ErrorHandler, catchAsyncError } from "../middlewares/error.js";
import { Comment } from "../models/comment.js";
import { Post } from "../models/post.js";
import { User } from "../models/user.js";
import { sendResponse } from "../utils/features.js";

const handlePostNotFound = (post) => {
    if (!post) {
        throw new ErrorHandler("Broken Link", 404, "POST_NOT_FOUND");
    }
};

const handleCommentNotFound = (comment) => {
    if (!comment) {
        throw new ErrorHandler("Comment not found", 404);
    }
};

const handleUnauthorizedCommentDeletion = (commentAuthorId, userId) => {
    if (commentAuthorId.toString() !== userId) {
        throw new ErrorHandler("Unauthorized", 403);
    }
};

export const createPost = catchAsyncError(async (req, res, next) => {
    const { image, content } = req.body;
    const { userId } = req;

    const user = await User.findById(userId);
    const post = new Post({ image, content, author: user });

    await post.save();
    user.posts.unshift(post._id);
    await user.save();

    sendResponse(req, res, 201, { post }, "Post created successfully");
});

export const updatePost = catchAsyncError(async (req, res, next) => {
    const { id: postId } = req.params;
    const post = await Post.findById(postId);

    handlePostNotFound(post);

    const { userId } = req;

    if (post.author != userId) {
        throw new ErrorHandler("Access Denied", 403, "ACCESS_DENIED");
    }

    const { image, content } = req.body;
    post.image = image;
    post.content = content;

    await post.save();

    sendResponse(req, res, 201, { post }, "Post updated successfully");
});

export const deletePost = catchAsyncError(async (req, res, next) => {
    const { id: postId } = req.params;
    const post = await Post.findById(postId);

    handlePostNotFound(post);

    const { userId } = req;

    if (post.author != userId) {
        throw new ErrorHandler("Access Denied", 403, "ACCESS_DENIED");
    }

    await User.findByIdAndUpdate(
        post.author,
        { $pull: { posts: postId } },
        { new: true }
    );

    await post.deleteOne();

    sendResponse(req, res, 201, { post }, "Post deleted successfully");
});

export const getPost = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);

    handlePostNotFound(post);

    sendResponse(req, res, 200, { post }, "Post retrieved successfully");
});

export const toggleLike = catchAsyncError(async (req, res, next) => {
    const { id: postId } = req.params;
    const post = await Post.findById(postId);

    handlePostNotFound(post);

    const { userId } = req;
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
        post.likes = post.likes.filter(likeId => likeId.toString() !== userId);
    } else {
        post.likes.push(userId);
    }

    await post.save();
    sendResponse(req, res, 200, null, "Like toggled successfully");
});

export const commentOnPost = catchAsyncError(async (req, res, next) => {
    const { id: postId } = req.params;
    const post = await Post.findById(postId);

    handlePostNotFound(post);

    const { userId } = req;
    const { text } = req.body;
    const comment = new Comment({ text, author: userId });

    await comment.save();
    post.comments.push(comment);
    await post.save();

    sendResponse(req, res, 200, null, "Comment added successfully");
});

export const deleteComment = catchAsyncError(async (req, res, next) => {
    const { commentId, id: postId } = req.params;
    const { userId } = req;

    const comment = await Comment.findById(commentId);
    const post = await Post.findById(postId);

    handleCommentNotFound(comment);
    handlePostNotFound(post);

    if (!post.comments.includes(commentId)) {
        throw new ErrorHandler("Comment not found", 404);
    }

    handleUnauthorizedCommentDeletion(comment.author, userId);

    await comment.deleteOne();
    post.comments = post.comments.filter(commentRef => commentRef.toString() !== commentId);
    await post.save();

    sendResponse(req, res, 200, null, "Comment deleted successfully");
});
