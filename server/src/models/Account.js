import mongoose from "mongoose";

export const ACCOUNT_TYPES = ["bank", "credit", "cash"];

const accountSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ACCOUNT_TYPES, default: "bank" },
    provider: { type: String, default: "other" },
    name: { type: String, required: true },
    balance: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Account", accountSchema);
