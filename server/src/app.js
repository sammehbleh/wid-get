import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import meRoutes from "./routes/me.js";
import accountRoutes from "./routes/accounts.js";
import noteRoutes from "./routes/notes.js";
import reminderRoutes from "./routes/reminders.js";
import todoRoutes from "./routes/todos.js";
import eventRoutes from "./routes/events.js";
import transactionRoutes from "./routes/transactions.js";
import budgetLimitRoutes from "./routes/budgetLimits.js";
import billRoutes from "./routes/bills.js";
import savingsGoalRoutes from "./routes/savingsGoals.js";

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/me", meRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budget-limits", budgetLimitRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/savings-goals", savingsGoalRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});

export default app;
