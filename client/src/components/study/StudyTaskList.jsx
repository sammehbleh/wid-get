import { useState } from "react";
import GlassCard from "../GlassCard";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { STUDY_CATEGORIES, detectStudyCategory } from "../../data/taskCategories";

const PRIORITIES = [
  { value: "high", label: "High", chip: "border-rose-400/40 bg-rose-500/10 text-rose-300" },
  { value: "medium", label: "Medium", chip: "border-amber-400/40 bg-amber-500/10 text-amber-300" },
  { value: "low", label: "Low", chip: "border-emerald-400/40 bg-emerald-500/10 text-emerald-300" },
];

function priorityMeta(value) {
  return PRIORITIES.find((p) => p.value === value) || PRIORITIES[1];
}

const emptyForm = { text: "", category: "Study", deadline: "", priority: "medium", notes: "" };

export default function StudyTaskList({ tasks, onChange, onSelectCurrent, currentTaskId }) {
  const { token } = useAuth();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [categoryTouched, setCategoryTouched] = useState(false);

  function resetForm() {
    setAdding(false);
    setEditingId(null);
    setForm(emptyForm);
    setCategoryTouched(false);
  }

  function startAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setAdding(true);
  }

  function startEdit(task) {
    setForm({
      text: task.text,
      category: task.category,
      deadline: task.deadline || "",
      priority: task.priority,
      notes: task.notes || "",
    });
    setCategoryTouched(true);
    setAdding(false);
    setEditingId(task._id);
  }

  function handleTextChange(value) {
    setForm((f) => ({ ...f, text: value }));
    if (!categoryTouched) {
      const suggestion = detectStudyCategory(value);
      if (suggestion) setForm((f) => ({ ...f, text: value, category: suggestion }));
    }
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.text.trim()) return;
    const payload = {
      text: form.text.trim(),
      category: form.category,
      deadline: form.deadline,
      priority: form.priority,
      notes: form.notes.trim(),
    };
    if (editingId) {
      await api.updateTodo(token, editingId, payload);
    } else {
      await api.createTodo(token, payload);
    }
    resetForm();
    onChange();
  }

  async function toggleDone(task) {
    await api.updateTodo(token, task._id, { done: !task.done });
    onChange();
  }

  async function remove(id) {
    await api.deleteTodo(token, id);
    onChange();
  }

  return (
    <GlassCard className="flex flex-col p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-200">Study Tasks</h2>
        <button onClick={startAdd} className="text-xs text-indigo-300 hover:text-indigo-200">
          + Add Task
        </button>
      </div>

      {(adding || editingId) && (
        <form onSubmit={submit} className="mt-3 space-y-2 rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <input
            value={form.text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Study Chemistry Chapter 5..."
            className="w-full min-w-0 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm outline-none focus:border-indigo-400"
          />
          <div className="flex gap-2">
            <select
              value={form.category}
              onChange={(e) => {
                setForm({ ...form, category: e.target.value });
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
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/10 px-2 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-400"
            >
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value} className="bg-slate-800">
                  {p.label}
                </option>
              ))}
            </select>
            <input
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              type="date"
              className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-xs outline-none focus:border-indigo-400"
            />
          </div>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Notes (optional)"
            rows={2}
            className="w-full min-w-0 resize-none rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm outline-none focus:border-indigo-400"
          />
          <div className="flex gap-2">
            <button type="submit" className="rounded-lg bg-indigo-500 px-3 py-1.5 text-sm hover:bg-indigo-400">
              {editingId ? "Save" : "Add"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-slate-300 hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <ul className="thin-scroll mt-3 max-h-64 space-y-2 overflow-y-auto">
        {tasks.length === 0 && (
          <li className="text-xs text-slate-400">No study tasks yet — add one above.</li>
        )}
        {tasks.map((t) => {
          const meta = priorityMeta(t.priority);
          const isCurrent = currentTaskId === t._id;
          return (
            <li
              key={t._id}
              className={`rounded-lg border p-2.5 transition ${
                isCurrent ? "border-indigo-400/50 bg-indigo-500/10" : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <label className="flex min-w-0 items-start gap-2">
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => toggleDone(t)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/30 bg-white/10"
                  />
                  <span className={`text-sm ${t.done ? "text-slate-500 line-through" : "text-slate-100"}`}>
                    {t.text}
                  </span>
                </label>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button onClick={() => startEdit(t)} className="text-xs text-indigo-300 hover:text-indigo-200">
                    Edit
                  </button>
                  <button onClick={() => remove(t._id)} className="text-xs text-slate-500 hover:text-rose-400">
                    ✕
                  </button>
                </div>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 pl-6 text-[10px]">
                <span className={`rounded-full border px-2 py-0.5 ${meta.chip}`}>{meta.label}</span>
                <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-slate-300">
                  {t.category}
                </span>
                {t.deadline && <span className="text-slate-400">Due {t.deadline}</span>}
                {!t.done && !isCurrent && (
                  <button
                    onClick={() => onSelectCurrent(t)}
                    className="text-indigo-300 hover:text-indigo-200"
                  >
                    Set as current
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </GlassCard>
  );
}
