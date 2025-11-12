import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import foodRoutes from "./routes/foodRoutes.js";
import foodRequestsRouter from "./routes/foodRequests.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// Debug middleware - log all requests
app.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.path}`);
  next();
});

// --- Quick backend test endpoint ---
app.get("/api/test", (req, res) => {
  console.log("✅ Backend test endpoint hit!");
  res.json({ message: "Backend is reachable!" });
});

// --- API Routes ---
app.use("/api/foods", foodRoutes);
app.use("/api/food-requests", foodRequestsRouter);

// --- Root endpoint ---
app.get("/", (req, res) => {
  res.send("🔥 PlateShare API is running...");
});

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// --- MongoDB connection and server start ---
const startServer = async () => {
  try {
    console.log("🔗 Connecting to MongoDB...");
    console.log("MONGO_URI:", process.env.MONGO_URI?.substring(0, 30) + "...");
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("✅ MongoDB connected successfully");
    console.log("📊 Database name:", mongoose.connection.name);
    
    // Start server only after DB connection
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log("📡 Ready to accept requests");
    });
    
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();