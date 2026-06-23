import "dotenv/config";
import app from "../src/app.js";
import { connectDB } from "../src/db.js";

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    res.status(500).json({ message: "Database connection failed" });
    return;
  }
  app(req, res);
}
