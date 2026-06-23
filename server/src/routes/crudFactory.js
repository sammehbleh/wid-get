import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

export function createCrudRouter(Model, allowedFields) {
  const router = Router();
  router.use(requireAuth);

  function pick(body) {
    const data = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) data[field] = body[field];
    }
    return data;
  }

  router.get("/", async (req, res) => {
    const items = await Model.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(items);
  });

  router.post("/", async (req, res) => {
    const item = await Model.create({ ...pick(req.body), user: req.userId });
    res.status(201).json(item);
  });

  router.patch("/:id", async (req, res) => {
    const item = await Model.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      pick(req.body),
      { new: true }
    );
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  });

  router.delete("/:id", async (req, res) => {
    const item = await Model.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!item) return res.status(404).json({ message: "Not found" });
    res.status(204).end();
  });

  return router;
}
