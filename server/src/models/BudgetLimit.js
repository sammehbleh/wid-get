import mongoose from "mongoose";

const budgetLimitSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    category: { type: String, required: true },
    limit: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

budgetLimitSchema.index({ user: 1, category: 1 }, { unique: true });

export default mongoose.model("BudgetLimit", budgetLimitSchema);
