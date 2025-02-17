import jwt from "jsonwebtoken";
import { hashPassword, verifyPassword } from "../utils/hashPassword.js";
import { Request, Response } from "express";

// Simulated database query function
async function findUserByEmail(db: any, email: string) {
    return await db.get("SELECT * FROM users WHERE email = ?", [email]);
}

export async function registerUser(req: Request, res: Response, db: any) {
    const { email, password, full_name, phone_number } = req.body;
    if (!email || !password || !full_name) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const existingUser = await findUserByEmail(db, email);
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const hashedPassword = await hashPassword(password);
        await db.run("INSERT INTO users (email, password, full_name, phone_number) VALUES (?, ?, ?, ?)", 
                     [email, hashedPassword, full_name, phone_number]);

        res.status(201).json({ message: "User registered successfully" });
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
        const user = await db.get("SELECT user_id, email, full_name FROM users WHERE user_id = ?", [userId]);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Server error" });
    }
}