import express from 'express';
import { getReceivedRatings, getGivenRating, addRating } from '../services/rating.service.js';
import { getDb } from "../db.js";
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// get rating for all user
router.get("/received_rating", authenticateToken, async (req, res) => {
    const db = await getDb();
    getReceivedRatings(req, res, db);
});

// get rating for a specific user
router.get("/given_rating", authenticateToken, async (req, res) => {
    const db = await getDb();
    getGivenRating(req, res, db);
});

// post a rating
router.post("/", authenticateToken, async (req, res) => {
    const db = await getDb();
    addRating(req, res, db);
});

// update a rating
router.put("/:rated_user", authenticateToken, async (req, res) => {
    const db = await getDb();
    //editRating(req, res, db);
});

export default router;