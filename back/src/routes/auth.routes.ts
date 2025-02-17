import express from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser } from "../services/auth.service.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { getDb } from "../db.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    const db = await getDb();
    registerUser(req, res, db);
});
router.post("/login", async (req, res) => {
    const db = await getDb();
    loginUser(req, res, db);
});
router.post("/logout", logoutUser);
router.get("/me", authenticateToken, async (req, res) => {
    const db = await getDb();
    getCurrentUser(req, res, db);
});

export default router;