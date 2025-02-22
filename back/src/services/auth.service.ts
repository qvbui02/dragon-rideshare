import jwt from "jsonwebtoken";
import { hashPassword, verifyPassword } from "../utils/hashPassword.js";
import { Request, Response } from "express";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/emailService.js";

// Simulated database query function
async function findUserByEmail(db: any, email: string) {
    return await db.get("SELECT * FROM users WHERE email = ?", [email]);
}

export async function registerUser(req: Request, res: Response, db: any) {
    const { email, password, full_name, phone_number } = req.body;
    if (!email || !password || !full_name) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (!email.endsWith('@drexel.edu')) {
        return res.status(400).json({ error: "Email must be a Drexel email" });
    }

    try {
        const existingUser = await findUserByEmail(db, email);
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const hashedPassword = await hashPassword(password);
        const result = await db.run(
            "INSERT INTO users (email, password, full_name, phone_number) VALUES (?, ?, ?, ?)",
            [email, hashedPassword, full_name, phone_number]
        );

        const userId = result.lastID;
        
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        await db.run(
            "INSERT INTO verification_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
            [userId, token, expiresAt]
        );

        await sendVerificationEmail(email, token);

        res.status(201).json({ message: "Registration successful. Please verify your email." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

export async function loginUser(req: Request, res: Response, db: any) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
    }

    try {
        const user = await findUserByEmail(db, email);
        if (!user || !(await verifyPassword(user.password, password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        if (!user.is_verified) {
            return res.status(403).json({ error: "Please verify your email before logging in." });
        }

        const isBanned = await db.get("SELECT * FROM banned_users WHERE user_id = ?", [user.user_id]);
        if (isBanned) {
            return res.status(403).json({ error: "You have been banned. Contact admin for more information." });
        }

        const JWT_SECRET = process.env.JWT_SECRET as string;
        const token = jwt.sign({ id: user.user_id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict"
        });

        res.json({ message: "Login successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

export function logoutUser(req: Request, res: Response) {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
}

export async function getCurrentUser(req: Request, res: Response, db: any) {
    try {
        const userId = (req as any).user.id;
        const user = await db.get(
            `SELECT u.user_id, u.email, u.full_name, 
                    CASE WHEN a.user_id IS NOT NULL THEN 1 ELSE 0 END AS is_admin
             FROM users u
             LEFT JOIN admins a ON u.user_id = a.user_id
             WHERE u.user_id = ?`, [userId]);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Server error" });
    }
}