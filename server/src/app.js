import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mysteryRoutes from "./routes/mystery.routes.js";

const app = express();

// The production host (for example Render) sits behind one trusted proxy.
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",").map((value) => value.trim())
    : "http://localhost:5173",
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
}));
app.use(express.json({ limit: "1mb" }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "MysteryRoom API is healthy", timestamp: new Date().toISOString() });
});

app.use("/api/mysteries", mysteryRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  const status = error.status || 500;
  res.status(status).json({
    success: false,
    message: status === 500 ? "An unexpected server error occurred" : error.message,
  });
});

export default app;
