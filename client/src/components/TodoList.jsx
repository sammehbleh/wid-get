import { useEffect, useState } from "react";
import GlassCard from "./GlassCard";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { BUDGET_CATEGORIES } from "../data/budget";
import { toLocalDateString } from "../utils/date";
import { TASK_CATEGORIES, detectStudyCategory } from "../data/taskCategories";

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
  const [category, setCategory] = useState("Other");
  const [categoryTouched, setCategoryTouched] = useState(false);

  const [linkExpense, setLinkExpense] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Bills");
  const [expensePaymentSource, setExpensePaymentSource] = useState("");

  useEffect(() => {
    api.listTodos(token).then(setTodos).catch(() => setTodos([]));
  }, [token]);

  function handleTextChange(value) {
    setText(value);
    if (!categoryTouched) {
      const suggestion = detectStudyCategory(value);
      if (suggestion) setCategory(suggestion);
    }
  }

  async function addTodo(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const created = await api.createTodo(token, {
      text: text.trim(),
      priority,
      category,
      linkExpense,
      expenseAmount: linkExpense ? Number(expenseAmount) || 0 : 0,
      expenseCategory,
      expensePaymentSource: expensePaymentSource.trim(),
    });
    setTodos((prev) => [created, ...prev]);
    setText("");
    setCategory("Other");
    setCategoryTouched(false);
    setLinkExpense(false);
    setExpenseAmount("");
    setExpensePaymentSource("");
  }

  async function toggleDone(todo) {
    const nextDone = !todo.done;

    if (nextDone && todo.linkExpense && !todo.expenseRecorded) {
      await api.createTransaction(token, {
        date: toLocalDateString(),
        category: todo.expenseCategory,
        description: todo.text,
        expense: todo.expenseAmount,
        paymentSource: todo.expensePaymentSource,
      });
      const updated = await api.updateTodo(token, todo._id, { done: true, expenseRecorded: true });
      setTodos((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      return;
    }

    const updated = await api.updateTodo(token, todo._id, { done: nextDone });
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
          onChange={(e) => handleTextChange(e.target.value)}
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
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setCategoryTouched(true);
            }}
            className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/10 px-2 py-1.5 text-sm text-slate-200 outline-none focus:border-indigo-400"
          >
            {TASK_CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-slate-800">
                {c}
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

        <label className="flex items-center gap-2 text-xs text-slate-300">
          <input
            type="checkbox"
            checked={linkExpense}
            onChange={(e) => setLinkExpense(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-white/30 bg-white/10"
          />
          Add as expense when completed
        </label>

        {linkExpense && (
          <div className="space-y-2 rounded-lg border border-white/10 bg-white/[0.03] p-2">
            <div className="flex gap-2">
              <select
                value={expenseCategory}
                onChange={(e) => setExpenseCategory(e.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-xs text-slate-200 outline-none focus:border-indigo-400"
              >
                {BUDGET_CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-slate-800">
                    {c}
                  </option>
                ))}
              </select>
              <input
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                type="number"
                step="0.01"
                placeholder="Amount"
                className="w-20 min-w-0 rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-xs outline-none focus:border-indigo-400"
              />
            </div>
            <input
              value={expensePaymentSource}
              onChange={(e) => setExpensePaymentSource(e.target.value)}
              placeholder="Payment source (optional)"
              className="w-full min-w-0 rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-xs outline-none focus:border-indigo-400"
            />
          </div>
        )}
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
                {t.linkExpense && (
                  <span
                    title={`Logs ₱${t.expenseAmount} to ${t.expenseCategory} when completed`}
                    className="text-xs text-emerald-300"
                  >
                    ₱
                  </span>
                )}
              </label>
              <div className="flex items-center gap-2">
                {t.category && t.category !== "Other" && (
                  <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] text-slate-300">
                    {t.category}
                  </span>
                )}
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
