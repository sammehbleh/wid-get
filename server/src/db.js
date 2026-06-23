import dns from "dns";
import mongoose from "mongoose";

// Some local networks leave Node's resolver pointed at a non-functional
// 127.0.0.1, which breaks the SRV lookups mongodb+srv:// URIs rely on.
// Falling back to public DNS keeps `mongodb+srv` working in that case.
if (dns.getServers().every((server) => server === "127.0.0.1")) {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Copy .env.example to .env and fill it in.");
  }
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
}
