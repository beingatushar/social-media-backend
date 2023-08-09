import jwt from 'jsonwebtoken';
import { ErrorHandler, catchAsyncError } from './error.js';
export const sendCookie = (res, user) => {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
    })

};
export const isAuthenticated = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) return next(new ErrorHandler("login first", 400));

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = userId;
    next();
})
export const clearCookies = (req, res) => {
    req.userId = null;
    res.cookie("token", "", {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
        sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
        secure: process.env.NODE_ENV === "Development" ? false : true,
        expires: new Date(Date.now())
    })
};
