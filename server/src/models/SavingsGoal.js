import mongoose from "mongoose";

const savingsGoalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    targetAmount: { type: Number, required: true, default: 0 },
    currentAmount: { type: Number, default: 0 },
    targetDate: { type: String, default: "" }, // "YYYY-MM-DD"
  },
  { timestamps: true }
);

export default mongoose.model("SavingsGoal", savingsGoalSchema);
