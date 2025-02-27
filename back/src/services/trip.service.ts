import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";

export async function getUserTrip(req: AuthenticatedRequest, res: Response, db: any) {
    const user_id = req.user?.id

    if (!user_id) {
        return res.status(400).json({ error: "Server error"});
    }

    try {
        const members = await db.all(
            `SELECT tm2.trip_id, tm2.user_id AS other_member_id, u.full_name, u.email, u.phone_number 
             FROM trip_members tm1
             JOIN trip_members tm2 ON tm1.trip_id = tm2.trip_id
             JOIN users u ON tm2.user_id = u.user_id
             WHERE tm1.user_id = ? AND tm2.user_id <> ?`,
            [user_id, user_id]
        );
        return res.status(200).json({ members });
    } catch {
        return res.status(400).json({ error: "Server error" });
    }
};