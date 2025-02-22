import { Request, Response, NextFunction } from "express";
import { getDb } from "../db.js";

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const db = await getDb();
        const admin = await db.get("SELECT * FROM admins WHERE user_id = ?", [userId]);

        if (!admin) {
            return res.status(403).json({ error: "Access denied. Admins only." });
        }

        next();
    } catch (error) {
        console.error("Admin check error:", error);
        res.status(500).json({ error: "Server error" });
    }
}
