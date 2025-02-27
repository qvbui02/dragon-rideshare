import express from 'express';
import { getReceivedRatings, getGivenRating, upsertRating } from '../services/rating.service.js';
import { getDb } from "../db.js";
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// get rating for user
router.get("/received_rating", authenticateToken, async (req, res) => {
    const db = await getDb();
    getReceivedRatings(req, res, db);
});

// get rating the user made
router.get("/given_rating", authenticateToken, async (req, res) => {
    const db = await getDb();
    getGivenRating(req, res, db);
});

// post a rating
//router.post("/", authenticateToken, async (req, res) => {
//    const db = await getDb();
//    addRating(req, res, db);
//});

// create or update a rating
router.post("/make_rating", authenticateToken, async (req, res) => {
    const db = await getDb();
    upsertRating(req, res, db);
});

export default router;