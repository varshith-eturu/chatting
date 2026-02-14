import express from "express";
const router = express.Router();

import  { signup, login, logout } from "../controllers/auth.controller.js"; 
import { protectRoute } from "../middleware/auth.middleware.js";
import { updateProfile, checkAuth } from "../controllers/auth.controller.js";

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile",protectRoute,updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router;