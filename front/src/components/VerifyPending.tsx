import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography } from '@mui/material';

const VerifyPending: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const userEmail = location.state?.email;
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const resendEmail = async () => {
        setIsLoading(true);
        try {
            await axios.post('/resend-verification', { email: userEmail });
            setMessage("Verification email resent! Check your inbox.");
        } catch {
            setMessage("Failed to resend verification email.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h5">Verify Your Email</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
                We sent a verification email to <strong>{userEmail}</strong>.
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
                Please check your inbox and click the verification link.
            </Typography>

            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Button onClick={resendEmail} variant="contained" disabled={isLoading}>
                    {isLoading ? "Resending..." : "Resend Verification Email"}
                </Button>

                {message && (
                    <Typography variant="body2" color="primary">
                        {message}
                    </Typography>
                )}

                <Button variant="outlined" onClick={() => navigate('/login')}>
                    Back to Login
                </Button>
            </Box>
        </Box>
    );
};

export default VerifyPending;