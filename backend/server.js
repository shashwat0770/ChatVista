import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";


import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";


import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";


dotenv.config();


const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);


// Lightweight health endpoint — useful for uptime monitors (UptimeRobot, etc.)
// Returns 200 when DB ping succeeds, 503 when DB not connected yet, and 500 on errors.
app.get("/health", async (req, res) => {
try {
if (!mongoose.connection || !mongoose.connection.db) {
return res.status(503).json({ status: "starting", message: "DB not connected yet" });
}
await mongoose.connection.db.admin().command({ ping: 1 });
return res.status(200).json({ status: "ok", time: new Date().toISOString() });
} catch (err) {
console.error("Health check error:", err.message);
return res.status(500).json({ status: "error", message: err.message });
}
});


app.use(express.static(path.join(__dirname, "/frontend/dist")));


app.get("*", (req, res) => {
res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});


server.listen(PORT, () => {
connectToMongoDB();
console.log(`Server Running on port ${PORT}`);
});