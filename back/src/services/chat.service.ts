import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";

export async function saveMessage(req: AuthenticatedRequest, res: Response, db: any) {
    const { trip_id, message } = req.body
    const sender_id = req.user?.id

    if (!trip_id || !sender_id || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        await db.run(
            "INSERT INTO chat_messages (trip_id, sender_id, message, sent_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
            [trip_id, sender_id, message]
        );

        return res.status(201).json({ message: "Succesfully saved message", trip_id, sender_id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error"})
    }
};

export async function getGroupChat(req: AuthenticatedRequest, res: Response, db: any) {
    const user_id = req.user?.id
    if (!user_id) {
        return res.status(400).json({ error: "User is not authenticated" });
    }

    try {
        const group_chats = await db.all(
            `SELECT t.trip_id, 
                    (SELECT COUNT(*) FROM trip_members WHERE trip_members.trip_id = t.trip_id) AS members,
                    (SELECT message FROM chat_messages WHERE chat_messages.trip_id = t.trip_id ORDER BY sent_at DESC LIMIT 1) AS lastMessage
             FROM trip_members tm
             JOIN trips t ON tm.trip_id = t.trip_id
             WHERE tm.user_id = ?`, [user_id]);
        
        return res.status(200).json({ group_chats })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

export async function getChatHistory(req: AuthenticatedRequest, res: Response, db: any) {
    const user_id = req.user?.id
    const trip_id = req.body
    if (!user_id || !trip_id) {
        return res.status(400).json({ error: "Missing user_id or trip_id" });
    }

    try {

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};