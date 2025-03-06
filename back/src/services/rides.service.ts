import { Request, Response } from "express";

export async function getAllRides(req: Request, res: Response, db: any) {
    try {
        const rides = await db.all(
            `SELECT 
                u.full_name AS created_by_name, 
                t.source, 
                t.destination, 
                t.source_radius, 
                t.destination_radius, 
                t.mode_of_transport, 
                t.departure_time, 
                t.departure_date, 
                t.max_passengers, 
                t.hours
            FROM trips t
            JOIN users u ON t.created_by = u.user_id
            WHERE t.is_active = 1;`
        );

        if (!rides || rides.length === 0) {
            return res.status(404).json({ error: "No active trips found" });
        }

        return rides;
    } catch (error) {
        console.error("Error fetching trips:", error);
        res.status(500).json({ error: "Server error" });
    }
}
