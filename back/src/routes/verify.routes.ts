import express, { Request, Response } from "express";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/emailService.js";
import { dbMiddleware } from "../middlewares/db.middleware.js";

const router = express.Router();

router.use(dbMiddleware);

router.get("/verify", async (req: Request, res: Response) => {
    const { token } = req.query;
    const db = (req as any).db;

    try {
        const tokenRecord = await db.get("SELECT * FROM verification_tokens WHERE token = ?", [token]);
        if (!tokenRecord || new Date() > new Date(tokenRecord.expires_at)) {
            return res.redirect(`/verify-failed?reason=expired`);
        }

        await db.run("UPDATE users SET is_verified = TRUE WHERE user_id = ?", [tokenRecord.user_id]);

        await db.run("DELETE FROM verification_tokens WHERE token = ?", [token]);

        res.redirect("/login?verified=true");
    } catch (error) {
        console.error("Verification error:", error);
        res.redirect(`/verify-failed?reason=server`);
    }
});

router.post("/resend-verification", async (req: Request, res: Response) => {
    const { email } = req.body;
    const db = (req as any).db;

    try {
        const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
        if (!user || user.is_verified) {
            return res.status(400).json({ error: "Invalid or already verified email" });
        }

        await db.run("DELETE FROM verification_tokens WHERE user_id = ?", [user.user_id]);

        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        await db.run("INSERT INTO verification_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
            [user.user_id, token, expiresAt]);

        await sendVerificationEmail(email, token);

        res.json({ message: "Verification email resent" });
    } catch (error) {
        console.error("Resend error:", error);
        res.status(500).json({ error: "Failed to resend verification email" });
    }
});

export default router;