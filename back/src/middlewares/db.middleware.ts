import { getDb } from "../db.js";
import { Request, Response, NextFunction } from "express";

export const dbMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const db = await getDb();
        (req as any).db = db;
        next();
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({ error: "Database connection error" });
    }
}; 