import express from 'express';
import { getUserTrip, getTripDetails } from '../services/trip.service.js';
import { getDb } from "../db.js";
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// get all trips the user are a part of
router.get("/members", authenticateToken, async (req, res) => {
    const db = await getDb();
    getUserTrip(req, res, db);
});

router.get("/details/:trip_id", authenticateToken, async (req, res) => {
    const db = await getDb();
    getTripDetails(req, res, db);
});

export default router;