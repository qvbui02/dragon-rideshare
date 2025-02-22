import express from "express";
import path from "path";
import * as url from "url";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import verifyRoutes from "./routes/verify.routes.js";
import { authenticateToken } from "./middlewares/auth.middleware.js";
import { getDb } from "./db.js";

let __dirname = url.fileURLToPath(new URL("..", import.meta.url));
// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env")});

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || "15", 10) * 60 * 1000, // 15 min default
  max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
});
app.use(limiter);

// Database setup
const db = await getDb();

// Serve frontend files
let reactAssetsPath = path.join(__dirname, "../front/dist");
app.use(express.static(reactAssetsPath));

// Routes
app.use("/api/auth", authRoutes);
app.use("/", verifyRoutes);

// Serve frontend index.html
app.get("*", (req, res) => {
  return res.sendFile("index.html", { root: reactAssetsPath });
});

// Start server (Fix applied: Convert PORT to number)
const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = process.env.HOST || "localhost";
const PROTOCOL = process.env.PROTOCOL || "http";

app.listen(PORT, HOST, () => {
  console.log(`${PROTOCOL}://${HOST}:${PORT}`);
});
