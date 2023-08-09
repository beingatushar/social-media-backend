import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        maxlength: [500, "Content cannot exceed 500 characters"],
        trim: true
    },
    image: {
        type: String,
        required: [true, "Image URL is required"] // Making image URL compulsory
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }
    ]
}, {
    timestamps: true
});

export const Post = mongoose.model("Post", postSchema);
