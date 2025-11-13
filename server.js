import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import foodRoutes from "./routes/foodRoutes.js";
import foodRequestsRouter from "./routes/foodRequests.js";
import foodRequestsManagement from "./routes/foodRequestsManagement.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    process.env.CLIENT_URL || ""
  ].filter(Boolean),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
  console.log(` ${req.method} ${req.path}`);
  next();
});

app.get("/api/test", (req, res) => {
  console.log("Backend test endpoint hit!");
  res.json({ message: "Backend is reachable!" });
});

app.use("/api/foods", foodRoutes);
app.use("/api/food-requests", foodRequestsRouter);
app.use("/api/food-requests", foodRequestsManagement);

app.get("/", (req, res) => {
  res.send("PlateShare API is running...");
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const startServer = async () => {
  try {
    console.log("Connecting to MongoDB...");
    console.log("MONGO_URI:", process.env.MONGO_URI?.substring(0, 30) + "...");
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("MongoDB connected successfully");
    console.log("Database name:", mongoose.connection.name);
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log("Ready to accept requests");
    });
    
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();