import { Router, Request, Response } from "express";
import { dbMiddleware } from "../middlewares/db.middleware.js";
import { getAllRides, joinTrip } from "../services/rides.service.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(dbMiddleware);

router.get("/", authenticateToken, async (req: Request, res: Response) => {
    const db = (req as any).db;
  
    try {
      const rides = await getAllRides(req, db);
  
      if (rides && rides.length > 0) {
        return res.status(200).json({ message: "All trips fetched successfully", rides });
      } else {
        // No rides found, just send an empty array or a 404
        // If you want to show "no results" in the frontend, send an empty array
        // or a custom message. Example:
        return res.status(200).json({ message: "No trips found", rides: [] });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error getting trips" });
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