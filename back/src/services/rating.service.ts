import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";

export async function getReceivedRatings(req: AuthenticatedRequest, res: Response, db: any) {
    const rated_user = req.user?.id

    if (!rated_user) {
        return res.status(400).json({ error: "Missing rated_user id"});
    }

    try {
        const ratings = await db.all(`SELECT * FROM user_ratings WHERE rated_user = ?`, [rated_user]);

        return res.status(200).json({ ratings });
    } catch {
        return res.status(400).json({ error: "Server error"});
    }
};

export async function getGivenRating(req: AuthenticatedRequest, res: Response, db: any) {
    const rated_by = req.user?.id
    if (!rated_by) {
        return res.status(400).json({ error: "Missing rated_by id"});
    }

    try {
        const ratings = await db.all(`SELECT * FROM user_ratings WHERE rated_by = ?`, [rated_by]);

        return res.status(200).json({ ratings });
    } catch {
        return res.status(400).json({ error: "Server error"});
    }
};

export async function addRating(req: AuthenticatedRequest, res: Response, db: any) {
    const rated_by = req.user?.id
    const { rated_user, trip_id, rating, feedback, created_at } = req.body

    if (!rated_by || !rated_user || !trip_id || !rating) {
        return res.status(400).json({ error: "Missing rated_by or rated_user or trip_id or rating"});
    }

    try {
        await db.run("INSERT INTO user_ratings (rated_by, rated_user, trip_id, rating, feedback, created_at) VALUES (?, ?, ?, ?, ?, ?)", 
                        [rated_by, rated_user, trip_id, rating, feedback ?? null, created_at]);

        return res.status(200).json({ message: "Thank you for rating."});
    } catch {
        return res.status(400).json({ error: "Server error"});
    }
};

export async function editRating(req: AuthenticatedRequest, res: Response, db: any) {
    const rated_by = req.user?.id;
    const { rated_user, trip_id, rating, feedback } = req.body;

    if (!rated_by || !rated_user || !trip_id) {
        return res.status(400).json({ error: "Missing rated_by, rated_user, or trip_id" });
    }

    try {
        // Check if the rating exists
        const existingRating = await db.get(
            "SELECT * FROM user_ratings WHERE rated_by = ? AND rated_user = ? AND trip_id = ?",
            [rated_by, rated_user, trip_id]
        );

        if (!existingRating) {
            return res.status(404).json({ error: "Rating not found" });
        }

        // Prepare the SQL statement dynamically based on provided fields
        const updates: string[] = [];
        const params: any[] = [];

        if (rating !== undefined) {
            updates.push("rating = ?");
            params.push(rating);
        }

        if (feedback !== undefined) {
            updates.push("feedback = ?");
            params.push(feedback);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: "No fields provided for update" });
        }

        params.push(rated_by, rated_user, trip_id);

        // Update the rating
        await db.run(
            `UPDATE user_ratings SET ${updates.join(", ")} WHERE rated_by = ? AND rated_user = ? AND trip_id = ?`,
            params
        );

        res.json({ message: "Rating updated successfully" });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};


