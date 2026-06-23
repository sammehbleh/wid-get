import dns from "dns";
import mongoose from "mongoose";

// Some local networks leave Node's resolver pointed at a non-functional
// 127.0.0.1, which breaks the SRV lookups mongodb+srv:// URIs rely on.
// Falling back to public DNS keeps `mongodb+srv` working in that case.
if (dns.getServers().every((server) => server === "127.0.0.1")) {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

let connectPromise = null;

// On serverless platforms each invocation can reuse a warm container, so we
// cache the connection (and the in-flight connect promise) instead of
// reconnecting — mongoose.connect() on an already-open connection is a no-op,
// but skipping it entirely avoids redundant work on every warm invocation.
export async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  if (connectPromise) return connectPromise;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Copy .env.example to .env and fill it in.");
  }

  connectPromise = mongoose.connect(uri).then(() => {
    console.log("Connected to MongoDB");
  });

  try {
    await connectPromise;
  } catch (err) {
    connectPromise = null;
    throw err;
  }
}
