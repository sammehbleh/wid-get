import { useEffect, useState } from "react";
import GlassCard from "./GlassCard";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["Personal", "School", "Work", "Ideas", "Finance", "Other"];

const SIZE_HEIGHTS = {
  compact: "min-h-[140px]",
  normal: "min-h-[220px]",
  large: "min-h-[420px]",
};

export default function Notepad({ size = "normal" }) {
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Personal");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.listNotes(token).then(setNotes).catch(() => setNotes([]));
  }, [token]);

  function selectNote(note) {
    setActiveId(note._id);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
  }

  function newNote() {
    setActiveId(null);
    setTitle("");
    setContent("");
    setCategory("Personal");
  }

  async function save() {
    if (!title.trim() && !content.trim()) return;
    setSaving(true);
    try {
      if (activeId) {
        const updated = await api.updateNote(token, activeId, { title, content, category });
        setNotes((prev) => prev.map((n) => (n._id === updated._id ? updated : n)));
      } else {
        const created = await api.createNote(token, { title, content, category });
        setNotes((prev) => [created, ...prev]);
        setActiveId(created._id);
      }
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    await api.deleteNote(token, id);
    setNotes((prev) => prev.filter((n) => n._id !== id));
    if (activeId === id) newNote();
  }

  return (
    <GlassCard className="flex h-full flex-col p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-200">Notepad</h2>
        <button onClick={newNote} className="text-xs text-indigo-300 hover:text-indigo-200">
          + New note
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {notes.map((n) => (
          <button
            key={n._id}
            onClick={() => selectNote(n)}
            className={`rounded-full border px-2.5 py-1 text-xs ${
              activeId === n._id
                ? "border-indigo-400 bg-indigo-500/30 text-white"
                : "border-white/15 bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            {n.title || "Untitled"}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm outline-none focus:border-indigo-400"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-white/15 bg-white/10 px-2 py-1.5 text-sm text-slate-200 outline-none focus:border-indigo-400"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c} className="bg-slate-800">
              {c}
            </option>
          ))}
        </select>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your note..."
        className={`mt-3 ${SIZE_HEIGHTS[size] || SIZE_HEIGHTS.normal} flex-1 resize-none rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none focus:border-indigo-400`}
      />

      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-indigo-500 px-4 py-1.5 text-sm hover:bg-indigo-400 disabled:opacity-50"
        >
          {saving ? "Saving..." : activeId ? "Update note" : "Save note"}
        </button>
        {activeId && (
          <button
            onClick={() => remove(activeId)}
            className="text-xs text-slate-400 hover:text-rose-400"
          >
            Delete
          </button>
        )}
      </div>
    </GlassCard>
  );
}
