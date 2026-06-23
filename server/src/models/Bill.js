import mongoose from "mongoose";

export const BILL_FREQUENCIES = ["none", "weekly", "monthly", "yearly"];

const billSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    dueDate: { type: String, required: true, index: true }, // "YYYY-MM-DD"
    amount: { type: Number, default: 0 },
    frequency: { type: String, enum: BILL_FREQUENCIES, default: "none" },
    reminderSentFor: { type: String, default: "" }, // dueDate a reminder was already created for
  },
  { timestamps: true }
);

export default mongoose.model("Bill", billSchema);
