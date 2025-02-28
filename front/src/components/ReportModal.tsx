import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

interface ReportModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ open, onClose, onSubmit }) => {
    const [reason, setReason] = useState("");

    const handleSubmit = () => {
        onSubmit(reason);
        setReason("");
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Report User</DialogTitle>
            <DialogContent>
                <TextField
                    label="Reason for Reporting"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Submit Report
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReportModal; 