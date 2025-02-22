import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

const VerifyFailed: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const reason = searchParams.get("reason");

    const errorMessage = reason === "expired"
        ? "This verification link has expired or is invalid."
        : "A server error occurred. Please try again later.";

    return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h5" color="error">
                Verification Failed
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
                {errorMessage}
            </Typography>

            <Button variant="outlined" sx={{ mt: 4 }} onClick={() => navigate("/login")}>
                Back to Login
            </Button>
        </Box>
    );
};

export default VerifyFailed;
