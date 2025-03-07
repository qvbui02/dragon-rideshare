import { Router, Request, Response } from "express";
import { dbMiddleware } from "../middlewares/db.middleware.js";
import { getAllRides, joinTrip } from "../services/rides.service.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(dbMiddleware);

router.get("/", authenticateToken, async (req: Request, res: Response) => {
    const db = (req as any).db;

    try {
        const rides = await getAllRides(req, res, db);

        if (rides && rides.length > 0) {
            res.status(200).json({ message: "All trips fetched successfully", rides });
        } else {
            res.status(404).json({ error: "No trips found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error getting trips" });
    }
});

router.post("/join-trip", authenticateToken, async (req: Request, res: Response) => {
    const db = (req as any).db;

    try {
        await joinTrip(req, res, db);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});




export default router;
