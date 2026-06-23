import mongoose from "mongoose";

export const TRANSACTION_CATEGORIES = [
  "Food",
  "Bills",
  "Transportation",
  "School",
  "Shopping",
  "Savings",
  "Emergency",
  "Entertainment",
  "Personal",
  "Other",
];

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: String, required: true, index: true }, // "YYYY-MM-DD"
    category: { type: String, enum: TRANSACTION_CATEGORIES, default: "Other" },
    description: { type: String, default: "" },
    income: { type: Number, default: 0 },
    expense: { type: Number, default: 0 },
    paymentSource: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
