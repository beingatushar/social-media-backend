import { Router } from "express";
import { registerUser, loginUser, getMyProfile, logoutUser, unfollowUser } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { followUser } from "../controllers/user.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", isAuthenticated, getMyProfile);
router.get("/logout", logoutUser);
router.post("/:userId/follow", isAuthenticated, followUser);
router.post("/:userId/unfollow", isAuthenticated, unfollowUser);

export default router;
