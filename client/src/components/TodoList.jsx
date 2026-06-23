import { useEffect, useState } from "react";
import GlassCard from "./GlassCard";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const PRIORITIES = [
  { value: "high", label: "High", dot: "bg-rose-500", chip: "border-rose-400/40 bg-rose-500/10 text-rose-300" },
  { value: "medium", label: "Medium", dot: "bg-amber-400", chip: "border-amber-400/40 bg-amber-500/10 text-amber-300" },
  { value: "low", label: "Low", dot: "bg-emerald-400", chip: "border-emerald-400/40 bg-emerald-500/10 text-emerald-300" },
];

function priorityMeta(value) {
  return PRIORITIES.find((p) => p.value === value) || PRIORITIES[1];
}

export default function TodoList({ className = "" }) {
  const { token } = useAuth();
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");

  useEffect(() => {
    api.listTodos(token).then(setTodos).catch(() => setTodos([]));
  }, [token]);

  async function addTodo(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const created = await api.createTodo(token, { text: text.trim(), priority });
    setTodos((prev) => [created, ...prev]);
    setText("");
  }

  async function toggleDone(todo) {
    const updated = await api.updateTodo(token, todo._id, { done: !todo.done });
    setTodos((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
  }

  async function remove(id) {
    await api.deleteTodo(token, id);
    setTodos((prev) => prev.filter((t) => t._id !== id));
  }

  return (
    <GlassCard className={`flex flex-col p-5 ${className}`}>
      <h2 className="text-sm font-medium text-slate-200">To-Do List</h2>

      <form onSubmit={addTodo} className="mt-3 space-y-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a task..."
          className="w-full min-w-0 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm outline-none focus:border-indigo-400"
        />
        <div className="flex gap-2">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/10 px-2 py-1.5 text-sm text-slate-200 outline-none focus:border-indigo-400"
          >
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value} className="bg-slate-800">
                {p.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-indigo-500 px-3 py-1.5 text-sm hover:bg-indigo-400"
          >
            Add
          </button>
        </div>
      </form>

      <ul className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto">
        {todos.length === 0 && <li className="text-xs text-slate-400">No tasks yet</li>}
        {todos.map((t) => {
          const meta = priorityMeta(t.priority);
          return (
            <li key={t._id} className="flex items-center justify-between gap-2 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggleDone(t)}
                  className="h-4 w-4 rounded border-white/30 bg-white/10"
                />
                <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                <span className={t.done ? "text-slate-500 line-through" : "text-slate-200"}>
                  {t.text}
                </span>
              </label>
              <div className="flex items-center gap-2">
                <span className={`rounded-full border px-2 py-0.5 text-[10px] ${meta.chip}`}>
                  {meta.label}
                </span>
                <button
                  onClick={() => remove(t._id)}
                  className="text-xs text-slate-500 hover:text-rose-400"
                >
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
