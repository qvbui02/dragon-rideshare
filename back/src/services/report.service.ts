import { Request, Response } from "express";

export const createReport = async (req: Request, res: Response, db: any) => {
    const { reported_user, trip_id, reason } = req.body;
    const reported_by = (req as any).user.id; // Assuming the user is authenticated

    if (!reported_user || !trip_id || !reason) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        await db.run(
            `INSERT INTO reports (reported_by, reported_user, trip_id, reason) VALUES (?, ?, ?, ?)`,
            [reported_by, reported_user, trip_id, reason]
        );
        res.status(201).json({ message: "Report submitted successfully" });
    } catch (error) {
        console.error("Error creating report:", error);
        res.status(500).json({ error: "Server error" });
    }
}; 