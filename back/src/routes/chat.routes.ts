import express from 'express';
import { getChatHistory } from '../services/chat.service.js';

const router = express.Router();

router.get('/history/:roomId', async (req, res) => {
    const { roomId } = req.params;
    const messages = await getChatHistory(roomId);
    res.json(messages);
});

export default router;
