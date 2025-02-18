import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/socketHelpers.js"

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const JWT_SECRET = process.env.JWT_SECRET as string;
    const token = req.cookies.token;
    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        (req as any).user = user;
        next();
    });
}

import { Socket } from "socket.io";

export const socketAuthMiddleware = (socket: Socket, next: (err?: Error) => void) => {
    const token = socket.handshake.auth?.token; // Extract token from handshake
    if (!token) {
        return next(new Error("Authentication error: No token provided"));
    }

    try {
        // Verify the token (example using JWT)
        const user = verifyToken(token); // Assume verifyToken is a function that validates JWTs
        socket.data.user = user; // Store user info in the socket instance
        next(); // Proceed to the next middleware
    } catch (error) {
        next(new Error("Authentication error: Invalid token"));
    }
};
