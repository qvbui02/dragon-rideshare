import express from 'express';
import { getChatHistory, getGroupChat, saveMessage } from '../services/chat.service.js';
import { getDb } from "../db.js";
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/inbox/:roomId', authenticateToken, async (req, res) => {
    const db = await getDb();
    getChatHistory(req, res, db);
});

router.get("/groups", authenticateToken, async (req, res) => {
    const db = await getDb();
    await getGroupChat(req, res, db);
});

router.post("/message", authenticateToken, async (req, res) => {
    const db = await getDb();
    saveMessage(req, res, db);
});

export default router;
