import { Router, Request, Response } from "express";
import { dbMiddleware } from "../middlewares/db.middleware.js";
import { getAllRides } from "../services/rides.service.js";

const router = Router();

router.use(dbMiddleware);

router.get("/", async (req: Request, res: Response) => {
    const db = (req as any).db;

    try {
        const rides = await getAllRides(req, res, db);

        if (rides && rides.length > 0) {
            res.status(200).json({ message: "All rides fetched successfully", rides });
        } else {
            res.status(404).json({ error: "No rides found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error getting rides" });
    }
});

export default router;
