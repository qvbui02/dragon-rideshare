import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/admin.middleware.js';
import { dbMiddleware } from '../middlewares/db.middleware.js';
import {
    getAllReports,
    updateReportStatus,
    banUser,
    unbanUser,
    getAllBannedUsers
} from '../services/admin.service.js';

const router = express.Router();

router.use(dbMiddleware);
router.use(authenticateToken);  // User must be logged in
router.use(isAdmin);            // User must be an admin

router.get('/reports', getAllReports);
router.patch('/report/:report_id', updateReportStatus);
router.post('/ban', banUser);
router.post('/unban', unbanUser);
router.get('/banned-users', getAllBannedUsers);

export default router;