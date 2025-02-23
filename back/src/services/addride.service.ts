import { Request, Response } from 'express';

export async function addRide(req: Request, res: Response, db: any) {
    const { source, destination, source_radius, destination_radius, mode_of_transport, departure_time, departure_date, max_passengers, hours } = req.body;
    const userId = (req as any).user?.id; 

    if (!userId) {
        throw new Error("User not authenticated");
    }

    if (!source || !destination || !mode_of_transport || !departure_time || !departure_date) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const result = await db.run(
            `INSERT INTO trips (created_by, source, destination, source_radius, destination_radius, mode_of_transport, departure_time, departure_date, max_passengers, hours) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, source, destination, source_radius, destination_radius, mode_of_transport, departure_time, departure_date, max_passengers, hours]
        );

        if (!result || !result.lastID) {
            throw new Error("Error saving the trip");
        }

        return { trip_id: result.lastID };
    } catch (error) {
        console.error(error);
        throw new Error("Database error while adding ride");
    }
}
