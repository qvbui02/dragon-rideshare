import express from 'express';
import { createReport } from '../services/report.service.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { getDb } from '../db.js';

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
    const db = await getDb();
    createReport(req, res, db);
});

export default router; 