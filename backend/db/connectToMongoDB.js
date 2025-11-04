import mongoose from "mongoose";


const connectToMongoDB = async () => {
try {
await mongoose.connect(process.env.MONGO_DB_URI, {
// Optional: you can add mongoose options here if you use any
});
console.log("✅ Connected to MongoDB");


// ----------------------------------------------------------
// 🟢 Keep-Alive Ping for MongoDB Atlas (prevents auto-pause)
// ----------------------------------------------------------
// Interval: 12 hours by default. Change if you prefer (e.g., 24 hours).
const KEEPALIVE_INTERVAL = 1000 * 60 * 60 * 12; // 12 hours


const pingDatabase = async () => {
try {
if (!mongoose.connection || !mongoose.connection.db) {
console.log("Keep-Alive: DB not ready yet");
return;
}
await mongoose.connection.db.admin().command({ ping: 1 });
console.log("📡 MongoDB Keep-Alive Ping sent at:", new Date().toISOString());
} catch (err) {
console.error("⚠️ Keep-Alive Ping failed:", err.message);
}
};


// Run one immediate ping once the connection is ready
setTimeout(pingDatabase, 3000); // slight delay to ensure DB is fully ready


// Schedule periodic pings
setInterval(pingDatabase, KEEPALIVE_INTERVAL);


} catch (error) {
console.log("❌ Error connecting to MongoDB:", error.message);
}
};


export default connectToMongoDB;