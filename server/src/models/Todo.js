import mongoose from "mongoose";

export const TODO_PRIORITIES = ["high", "medium", "low"];

const todoSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    text: { type: String, required: true },
    priority: { type: String, enum: TODO_PRIORITIES, default: "medium" },
    done: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Todo", todoSchema);
