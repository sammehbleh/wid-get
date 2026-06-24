import { useState } from "react";
import GlassCard from "../GlassCard";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { STUDY_CATEGORIES, detectStudyCategory } from "../../data/taskCategories";

function timeRemaining(dueDate) {
  if (!dueDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + "T00:00:00");
  const days = Math.round((due - today) / (1000 * 60 * 60 * 24));
  if (days < 0) return { label: `Overdue by ${Math.abs(days)}d`, tone: "text-rose-300" };
  if (days === 0) return { label: "Due today", tone: "text-amber-300" };
  if (days === 1) return { label: "Due tomorrow", tone: "text-amber-300" };
  return { label: `Due in ${days}d`, tone: "text-slate-400" };
}

export default function StudyReminders({ reminders, onChange }) {
  const { token } = useAuth();
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Study");
  const [categoryTouched, setCategoryTouched] = useState(false);
  const [dueDate, setDueDate] = useState("");

  function handleTextChange(value) {
    setText(value);
    if (!categoryTouched) {
      const suggestion = detectStudyCategory(value);
      if (suggestion) setCategory(suggestion);
    }
  }

  async function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    await api.createReminder(token, { text: text.trim(), category, dueDate });
    setText("");
    setCategory("Study");
    setCategoryTouched(false);
    setDueDate("");
    setAdding(false);
    onChange();
  }

  async function toggleDone(reminder) {
    await api.updateReminder(token, reminder._id, { done: !reminder.done });
    onChange();
  }

  async function remove(id) {
    await api.deleteReminder(token, id);
    onChange();
  }

  return (
    <GlassCard className="flex flex-col p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-200">Study Reminders</h2>
        <button onClick={() => setAdding((v) => !v)} className="text-xs text-indigo-300 hover:text-indigo-200">
          {adding ? "Cancel" : "+ Add"}
        </button>
      </div>

      {adding && (
        <form onSubmit={submit} className="mt-3 space-y-2 rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <input
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Submit assignment..."
            className="w-full min-w-0 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm outline-none focus:border-indigo-400"
          />
          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCategoryTouched(true);
              }}
              className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/10 px-2 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-400"
            >
              {STUDY_CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-slate-800">
                  {c}
                </option>
              ))}
            </select>
            <input
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              type="date"
              className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-xs outline-none focus:border-indigo-400"
            />
          </div>
          <button type="submit" className="rounded-lg bg-indigo-500 px-3 py-1.5 text-sm hover:bg-indigo-400">
            Add
          </button>
        </form>
      )}

      <ul className="mt-3 space-y-2">
        {reminders.length === 0 && <li className="text-xs text-slate-400">No study reminders yet</li>}
        {reminders.map((r) => {
          const remaining = timeRemaining(r.dueDate);
          return (
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
              </label>
              <div className="flex shrink-0 items-center gap-2 text-xs">
                {remaining && <span className={remaining.tone}>{remaining.label}</span>}
                <button onClick={() => remove(r._id)} className="text-slate-500 hover:text-rose-400">
                  ✕
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </GlassCard>
  );
}
