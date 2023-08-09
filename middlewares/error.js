import { sendResponse } from "../utils/features.js";

export class ErrorHandler extends Error {
    constructor(message, statusCode = 500, code = "UNKNOWN_ERROR") {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
    }
}

export const catchAsyncError = (func) => (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch(next);
};

export const errorMiddleware = (err, req, res, next) => {
    return sendResponse(req, res, err.statusCode || 500, null, err);
};
