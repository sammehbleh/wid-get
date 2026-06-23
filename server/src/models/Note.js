import mongoose from "mongoose";

export const NOTE_CATEGORIES = ["Personal", "School", "Work", "Ideas", "Finance", "Other"];

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, default: "" },
    content: { type: String, default: "" },
    category: { type: String, enum: NOTE_CATEGORIES, default: "Other" },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
