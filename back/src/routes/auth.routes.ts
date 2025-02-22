import express from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser } from "../services/auth.service.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { dbMiddleware } from "../middlewares/db.middleware.js";

const router = express.Router();

router.use(dbMiddleware);
router.post("/register", async (req: express.Request, res: express.Response) => {
    const db = (req as any).db;
    registerUser(req, res, db);
});
router.post("/login", async (req: express.Request, res: express.Response) => {
    const db = (req as any).db;
    loginUser(req, res, db);
});
router.post("/logout", logoutUser);
router.get("/me", authenticateToken, async (req: express.Request, res: express.Response) => {
    const db = (req as any).db;
    getCurrentUser(req, res, db);
});

export default router;