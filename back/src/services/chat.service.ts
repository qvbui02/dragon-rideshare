import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";

export async function saveMessage(req: AuthenticatedRequest, res: Response, db: any) {
    const { trip_id, message, sent_at } = req.body
    const sender_id = req.user?.id

    if (!trip_id || !sender_id || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        await db.run(
            "INSERT INTO chat_messages (trip_id, sender_id, message, sent_at) VALUES (?, ?, ?, ?)",
            [trip_id, sender_id, message, sent_at]
        );

        return res.status(201).json({ message: "Succesfully saved message"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error"})
    }
};

export async function getGroupChat(req: AuthenticatedRequest, res: Response, db: any) {
    const sender_id = req.user?.id
    if (!sender_id) {
        return res.status(400).json({ error: "User is not authenticated" });
    }

    try {
        const group_chats = await db.all(
            `SELECT t.trip_id, 
                    (SELECT COUNT(*) FROM trip_members WHERE trip_members.trip_id = t.trip_id) AS members,
                    (SELECT message FROM chat_messages WHERE chat_messages.trip_id = t.trip_id ORDER BY sent_at DESC LIMIT 1) AS lastMessage
             FROM trip_members tm
             JOIN trips t ON tm.trip_id = t.trip_id
             WHERE tm.user_id = ?`, [sender_id]);
        
        return res.status(200).json({ group_chats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

export async function getChatHistory(req: AuthenticatedRequest, res: Response, db: any) {
    const trip_id = req.params.trip_id;
    if (!trip_id) {
        return res.status(400).json({ error: "Missing trip_id" });
    }

    try {
        const historic_message = await db.all(
            `SELECT cm.message_id, cm.trip_id, cm.sender_id, u.full_name AS username, cm.message, cm.sent_at
            FROM chat_messages cm
            JOIN users u on u.user_id = cm.sender_id
            WHERE cm.trip_id = ?
            ORDER BY cm.sent_at ASC`, [trip_id]);

        return res.status(200).json({ historic_message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};