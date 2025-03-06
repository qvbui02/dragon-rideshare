import express from "express";
import path from "path";
import * as url from "url";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import verifyRoutes from "./routes/verify.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import addRideRoutes from "./routes/addride.routes.js";
import rideRoutes from "./routes/rides.routes.js";
import { Server } from "socket.io";
import chatRoutes from "./routes/chat.routes.js";
import { initChatServer } from "./websocket/chat.js";
import http from "http";
import cors from "cors";

let __dirname = url.fileURLToPath(new URL("..", import.meta.url));
// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env")});

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

initChatServer(io);
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || "15", 10) * 60 * 1000, // 15 min default
  max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
});
app.use(limiter);
app.use("/api/chat", chatRoutes);

// Serve frontend files
let reactAssetsPath = path.join(__dirname, "../front/dist");
app.use(express.static(reactAssetsPath));

// Routes
app.use("/api/auth", authRoutes);
app.use("/", verifyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/addride", addRideRoutes);
app.use("/api/rides", rideRoutes);

// Serve frontend index.html
app.get("*", (req, res) => {
  return res.sendFile("index.html", { root: reactAssetsPath });
});

// Start server (Fix applied: Convert PORT to number)
const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = process.env.HOST || "localhost";
const PROTOCOL = process.env.PROTOCOL || "http";

server.listen(PORT, HOST, () => {
  console.log(`${PROTOCOL}://${HOST}:${PORT}`);
});
