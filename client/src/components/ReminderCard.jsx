import { useEffect, useState } from "react";
import GlassCard from "./GlassCard";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { TASK_CATEGORIES, detectStudyCategory } from "../data/taskCategories";

export default function ReminderCard({ className = "" }) {
  const { token } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Other");
  const [categoryTouched, setCategoryTouched] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    api.listReminders(token).then(setReminders).catch(() => setReminders([]));
  }, [token]);

  function handleTextChange(value) {
    setText(value);
    if (!categoryTouched) {
      const suggestion = detectStudyCategory(value);
      if (suggestion) setCategory(suggestion);
    }
  }

  async function addReminder(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const created = await api.createReminder(token, { text: text.trim(), category, dueDate });
    setReminders((prev) => [created, ...prev]);
    setText("");
    setCategory("Other");
    setCategoryTouched(false);
    setDueDate("");
    setShowMore(false);
  }

  async function toggleDone(reminder) {
    const updated = await api.updateReminder(token, reminder._id, { done: !reminder.done });
    setReminders((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
  }

  async function remove(id) {
    await api.deleteReminder(token, id);
    setReminders((prev) => prev.filter((r) => r._id !== id));
  }

  return (
    <GlassCard className={`flex flex-col p-5 ${className}`}>
      <h2 className="text-sm font-medium text-slate-200">Reminders</h2>

      <form onSubmit={addReminder} className="mt-3 space-y-2">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onFocus={() => setShowMore(true)}
            placeholder="Add a reminder..."
            className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm outline-none focus:border-indigo-400"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-indigo-500 px-3 py-1.5 text-sm hover:bg-indigo-400"
          >
            Add
          </button>
        </div>
        {showMore && (
          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCategoryTouched(true);
              }}
              className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-xs text-slate-200 outline-none focus:border-indigo-400"
            >
              {TASK_CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-slate-800">
                  {c}
                </option>
              ))}
            </select>
            <input
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              type="date"
              className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-xs outline-none focus:border-indigo-400"
            />
          </div>
        )}
      </form>

      <ul className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto">
        {reminders.length === 0 && (
          <li className="text-xs text-slate-400">No reminders yet</li>
        )}
        {reminders.map((r) => (
          <li key={r._id} className="flex items-center justify-between gap-2 text-sm">
            <label className="flex min-w-0 items-center gap-2">
              <input
                type="checkbox"
                checked={r.done}
                onChange={() => toggleDone(r)}
                className="h-4 w-4 shrink-0 rounded border-white/30 bg-white/10"
              />
              <span className={`truncate ${r.done ? "text-slate-500 line-through" : "text-slate-200"}`}>
                {r.text}
              </span>
              {r.category && r.category !== "Other" && (
                <span className="shrink-0 rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] text-slate-300">
                  {r.category}
                </span>
              )}
            </label>
            <button
              onClick={() => remove(r._id)}
              className="shrink-0 text-xs text-slate-500 hover:text-rose-400"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
