import { Request, Response } from "express";

// Get all reports
export const getAllReports = async (req: Request, res: Response) => {
    const db = (req as any).db;

    try {
        const reports = await db.all(`
            SELECT r.*, u1.full_name AS reported_by_name, u2.full_name AS reported_user_name 
            FROM reports r
            JOIN users u1 ON r.reported_by = u1.user_id
            JOIN users u2 ON r.reported_user = u2.user_id
        `);

        res.json(reports);
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Update report status
export const updateReportStatus = async (req: Request, res: Response) => {
    const { report_id } = req.params;
    const { status } = req.body;
    const db = (req as any).db;

    try {
        await db.run("UPDATE reports SET status = ? WHERE report_id = ?", [status, report_id]);
        res.json({ message: "Report status updated" });
    } catch (error) {
        console.error("Error updating report status:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Ban user
export const banUser = async (req: Request, res: Response) => {
    const { user_id, reason } = req.body;
    const admin_id = (req as any).user.id;
    const db = (req as any).db;

    try {
        await db.run(
            "INSERT INTO banned_users (admin_id, user_id, reason) VALUES (?, ?, ?)",
            [admin_id, user_id, reason]
        );
        res.json({ message: "User banned successfully" });
    } catch (error) {
        console.error("Error banning user:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Unban user
export const unbanUser = async (req: Request, res: Response) => {
    const { user_id } = req.body;
    const db = (req as any).db;

    try {
        await db.run("DELETE FROM banned_users WHERE user_id = ?", [user_id]);
        res.json({ message: "User unbanned successfully" });
    } catch (error) {
        console.error("Error unbanning user:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get all banned users
export const getAllBannedUsers = async (req: Request, res: Response) => {
    const db = (req as any).db;

    try {
        const bannedUsers = await db.all(`
            SELECT b.*, u.full_name AS banned_user_name, a.full_name AS admin_name
            FROM banned_users b
            JOIN users u ON b.user_id = u.user_id
            JOIN users a ON b.admin_id = a.user_id
        `);

        res.json(bannedUsers);
    } catch (error) {
        console.error("Error fetching banned users:", error);
        res.status(500).json({ error: "Server error" });
    }
};
