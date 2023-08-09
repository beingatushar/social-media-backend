import bcrypt from "bcrypt";
import { ErrorHandler, catchAsyncError } from "../middlewares/error.js";
import { User } from "../models/user.js";
import { sendCookie, clearCookies } from "../middlewares/auth.js";
import { sendResponse } from "../utils/features.js";

export const registerUser = catchAsyncError(async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) | 10);

    let user = await User.findOne({ $or: [{ username }, { email }] }).select("+password");
    if (user) {

        return next(new ErrorHandler("User already exists", 400, "DUPLICATE_REQUEST"));
    }
    user = new User({
        username,
        email,
        password: hashedPassword
    });

    await user.save();
    sendCookie(res, user);
    sendResponse(req, res, 201, { user });
});

export const loginUser = catchAsyncError(async (req, res, next) => {
    const { email, username, password } = req.body;
    const user = await User.findOne({ $or: [{ username }, { email }] }).select("+password");

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!user || !isPasswordMatch) {
        return next(new ErrorHandler("Wrong username or password", 400, "INVALID_CREDENTIALS"));
    }
    sendCookie(res, user);
    sendResponse(req, res, 200, { user });
});

export const getMyProfile = catchAsyncError(async (req, res, next) => {
    const { userId } = req;

    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    sendResponse(req, res, 200, { user });
});

export const logoutUser = (req, res, next) => {
    clearCookies(req, res);
    sendResponse(req, res, 200);
};

export const followUser = catchAsyncError(async (req, res, next) => {
    const userIdToFollow = req.params.userId;
    const { userId } = req;

    if (userId === userIdToFollow) {
        return next(new ErrorHandler("You cannot follow yourself", 400));
    }

    const [userToFollow, currentUser] = await Promise.all([
        User.findById(userIdToFollow),
        User.findById(userId)
    ]);

    if (!userToFollow || !currentUser) {
        return next(new ErrorHandler("User not found", 404));
    }

    if (currentUser.following.includes(userIdToFollow)) {
        return sendResponse(req, res, 400, { message: "Already following this user" });
    }

    currentUser.following.push(userIdToFollow);
    userToFollow.followers.push(userId);

    await Promise.all([currentUser.save(), userToFollow.save()]);

    sendResponse(req, res, 200, { message: "User followed successfully" });
});

export const unfollowUser = catchAsyncError(async (req, res, next) => {
    const userIdToUnfollow = req.params.userId;
    const { userId } = req;

    if (userId === userIdToUnfollow) {
        return sendResponse(req, res, 400, { message: "You cannot unfollow yourself" });
    }

    const [userToUnfollow, currentUser] = await Promise.all([
        User.findById(userIdToUnfollow),
        User.findById(userId)
    ]);

    if (!userToUnfollow || !currentUser) {
        return next(new ErrorHandler("User not found", 404));
    }

    if (!currentUser.following.includes(userIdToUnfollow)) {
        return sendResponse(req, res, 400, { message: "Not following this user" });
    }

    currentUser.following = currentUser.following.filter(id => id.toString() !== userIdToUnfollow);
    userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== userId);

    await Promise.all([currentUser.save(), userToUnfollow.save()]);

    sendResponse(req, res, 200, { message: "User unfollowed successfully" });
});
