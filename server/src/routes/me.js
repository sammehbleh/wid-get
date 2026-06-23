import { Router } from "express";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId).select("name email");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ id: user._id, name: user.name, email: user.email });
});

export default router;
