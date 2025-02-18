export const formatMessage = (username: string, text: string) => {
    return {
        username,
        text,
        time: new Date().toISOString(),
    };
};

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fa95b78c77a89ca5f6e033b636379d07729b98b793aa7e64e754a996025832d7"; // Use environment variable in production

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
};