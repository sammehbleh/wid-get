import { useEffect, useState } from "react";
import { DEFAULT_LAYOUT } from "../data/widgets";

function storageKey(userId) {
  return `wid-get-dashboard-layout:${userId || "anon"}`;
}

function loadLayout(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return DEFAULT_LAYOUT;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_LAYOUT, ...parsed };
  } catch {
    return DEFAULT_LAYOUT;
  }
}

export function useDashboardLayout(userId) {
  const [layout, setLayout] = useState(() => loadLayout(userId));

  useEffect(() => {
    setLayout(loadLayout(userId));
  }, [userId]);

  useEffect(() => {
    localStorage.setItem(storageKey(userId), JSON.stringify(layout));
  }, [layout, userId]);

  function findColumn(id) {
    if (layout.left.includes(id)) return "left";
    if (layout.right.includes(id)) return "right";
    return null;
  }

  function moveWidget(activeId, overId) {
    setLayout((prev) => {
      const from = prev.left.includes(activeId) ? "left" : "right";
      let to = prev.left.includes(overId)
        ? "left"
        : prev.right.includes(overId)
        ? "right"
        : overId === "left" || overId === "right"
        ? overId
        : null;
      if (!to) return prev;

      const next = { ...prev, left: [...prev.left], right: [...prev.right] };
      next[from] = next[from].filter((id) => id !== activeId);

      const overIndex = next[to].indexOf(overId);
      const insertAt = overIndex === -1 ? next[to].length : overIndex;
      next[to].splice(insertAt, 0, activeId);
      return next;
    });
  }

  function hideWidget(id) {
    setLayout((prev) => ({
      ...prev,
      left: prev.left.filter((w) => w !== id),
      right: prev.right.filter((w) => w !== id),
      hidden: [...prev.hidden, id],
    }));
  }

  function showWidget(id) {
    setLayout((prev) => ({
      ...prev,
      hidden: prev.hidden.filter((w) => w !== id),
      right: [...prev.right, id],
    }));
  }

  function setNotepadSize(size) {
    setLayout((prev) => ({ ...prev, notepadSize: size }));
  }

  function reset() {
    setLayout(DEFAULT_LAYOUT);
  }

  return { layout, findColumn, moveWidget, hideWidget, showWidget, setNotepadSize, reset };
}
