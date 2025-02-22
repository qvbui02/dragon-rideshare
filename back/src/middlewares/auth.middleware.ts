import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getDb } from "../db.js";

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const JWT_SECRET = process.env.JWT_SECRET as string;
    const token = req.cookies.token;
    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, JWT_SECRET, async (err: any, user: any) => {
        if (err) return res.sendStatus(403);

        try {
            const db = await getDb();
            const dbUser = await db.get("SELECT is_verified FROM users WHERE user_id = ?", [user.id]);

            if (!dbUser?.is_verified) {
                return res.status(403).json({ error: "Email not verified" });
            }

            (req as any).user = user;
            next();
        } catch (dbError) {
            console.error(dbError);
            return res.status(500).json({ error: "Database error" });
        }
    });
}