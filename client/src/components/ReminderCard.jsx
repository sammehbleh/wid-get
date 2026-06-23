import { useEffect, useState } from "react";
import GlassCard from "./GlassCard";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function ReminderCard({ className = "" }) {
  const { token } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    api.listReminders(token).then(setReminders).catch(() => setReminders([]));
  }, [token]);

  async function addReminder(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const created = await api.createReminder(token, { text: text.trim() });
    setReminders((prev) => [created, ...prev]);
    setText("");
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

      <form onSubmit={addReminder} className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a reminder..."
          className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm outline-none focus:border-indigo-400"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-indigo-500 px-3 py-1.5 text-sm hover:bg-indigo-400"
        >
          Add
        </button>
      </form>

      <ul className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto">
        {reminders.length === 0 && (
          <li className="text-xs text-slate-400">No reminders yet</li>
        )}
        {reminders.map((r) => (
          <li key={r._id} className="flex items-center justify-between gap-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={r.done}
                onChange={() => toggleDone(r)}
                className="h-4 w-4 rounded border-white/30 bg-white/10"
              />
              <span className={r.done ? "text-slate-500 line-through" : "text-slate-200"}>
                {r.text}
              </span>
            </label>
            <button
              onClick={() => remove(r._id)}
              className="text-xs text-slate-500 hover:text-rose-400"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
