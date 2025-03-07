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

export const joinTrip = async (req: Request, res: Response, db: any) => {
    const { trip_id } = req.body;
    const userId = (req as any).user?.id;

    if (!trip_id) {
        console.error("Error: Trip ID is missing in request body");
        return res.status(400).json({ error: "Trip ID is required" });
    }

    try {

        const existingMember = await db.get(
            "SELECT * FROM trip_members WHERE trip_id = ? AND user_id = ?",
            [trip_id, userId]
        );

        if (existingMember) {
            return res.status(400).json({ error: "You have already joined this trip" });
        }

        await db.run(
            "INSERT INTO trip_members (trip_id, user_id) VALUES (?, ?)",
            [trip_id, userId]
        );

        res.status(200).json({ message: "Successfully joined the trip" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};
