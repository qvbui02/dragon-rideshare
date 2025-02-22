/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
    Container, Typography, Paper, Button, Table, TableHead,
    TableRow, TableCell, TableBody, Select, MenuItem, TextField,
    Box
} from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";

const AdminPanel: React.FC = () => {
    const { user } = useContext(AuthContext);
    const [reports, setReports] = useState<any[]>([]);
    const [bannedUsers, setBannedUsers] = useState<any[]>([]);
    const [banReason, setBanReason] = useState("");
    const isAdmin = user?.is_admin;

    useEffect(() => {
        if (isAdmin) {
            fetchReports();
            fetchBannedUsers();
        }
    }, [isAdmin]);

    const fetchReports = async () => {
        const res = await axios.get("/api/admin/reports", { withCredentials: true });
        setReports(res.data);
    };

    const fetchBannedUsers = async () => {
        const res = await axios.get("/api/admin/banned-users", { withCredentials: true });
        setBannedUsers(res.data);
    };

    const handleStatusChange = async (report_id: number, status: string) => {
        await axios.patch(`/api/admin/report/${report_id}`, { status });
        fetchReports();
    };

    const handleBanUser = async (user_id: number) => {
        await axios.post("/api/admin/ban", { user_id, reason: banReason });
        fetchBannedUsers();
        setBanReason("");
    };

    const handleUnbanUser = async (user_id: number) => {
        await axios.post("/api/admin/unban", { user_id });
        fetchBannedUsers();
    };

    const isUserBanned = (user_id: number) => {
        return bannedUsers.some((user) => user.user_id === user_id);
    };

    if (!isAdmin) {
        return (
            <Container>
                <Typography variant="h4" sx={{ mt: 4 }}>Not Authorized</Typography>
                <Typography variant="body1">You do not have permission to access this page.</Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h4" sx={{ mt: 4 }}>Admin Panel</Typography>
            {/* Reports Section */}
            <Paper sx={{ mt: 4, p: 3 }}>
                <Typography variant="h6">User Reports</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Reported By</TableCell>
                            <TableCell>Reported User</TableCell>
                            <TableCell>Reason</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reports.map((report) => (
                            <TableRow key={report.report_id}>
                                <TableCell>{report.reported_by_name}</TableCell>
                                <TableCell>{report.reported_user_name}</TableCell>
                                <TableCell>{report.reason}</TableCell>
                                <TableCell>{report.status}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <Select
                                            value={report.status}
                                            onChange={(e) => handleStatusChange(report.report_id, e.target.value)}
                                            size="small"
                                            sx={{ minWidth: 120 }}
                                        >
                                            <MenuItem value="Pending">Pending</MenuItem>
                                            <MenuItem value="Reviewed">Reviewed</MenuItem>
                                            <MenuItem value="Resolved">Resolved</MenuItem>
                                        </Select>
                                        <TextField
                                            size="small"
                                            placeholder="Ban Reason"
                                            value={banReason}
                                            onChange={(e) => setBanReason(e.target.value)}
                                        />
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleBanUser(report.reported_user)}
                                            disabled={isUserBanned(report.reported_user)}
                                        >
                                            {isUserBanned(report.reported_user) ? "Banned" : "Ban"}
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
            {/* Banned Users Section */}
            <Paper sx={{ mt: 4, p: 3 }}>
                <Typography variant="h6">Banned Users</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Banned User</TableCell>
                            <TableCell>Reason</TableCell>
                            <TableCell>Banned By</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bannedUsers.map((user) => (
                            <TableRow key={user.user_id}>
                                <TableCell>{user.banned_user_name}</TableCell>
                                <TableCell>{user.reason}</TableCell>
                                <TableCell>{user.admin_name}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleUnbanUser(user.user_id)}
                                    >
                                        Unban
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
};

export default AdminPanel;