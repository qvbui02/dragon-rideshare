import { Router, Request, Response } from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { dbMiddleware } from "../middlewares/db.middleware.js";
import { addRide } from "../services/addride.service.js";

const router = Router();

router.use(dbMiddleware);

router.post("/", authenticateToken, async (req: Request, res: Response) => {
    const db = (req as any).db;

    const { source, destination, source_radius, destination_radius, mode_of_transport, departure_time, departure_date, max_passengers, hours } = req.body;

    if (!source || !destination || !mode_of_transport || !departure_time || !departure_date) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const result = await addRide(req, res, db);
        if (result) {
            res.status(201).json({ message: "Ride added successfully" });
        } else {
            res.status(500).json({ error: "Failed to add ride" });
        }
    } catch (error: any) {
        console.error(error);
        if (error.message.includes("Geocoding failed")) {
            res.status(400).json({ error: error.message }); // e.g., "Geocoding failed for address..."
        } else {
            res.status(500).json({ error: "Error adding ride" });
        }
    }
});

export default router;