import { useState } from "react";
import GlassCard from "./GlassCard";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { toLocalDateString } from "../utils/date";

function formatMoney(n) {
  return `₱${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

function daysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr + "T00:00:00");
  return Math.round((due - today) / (1000 * 60 * 60 * 24));
}

function targetDateLabel(dateStr) {
  if (!dateStr) return null;
  const days = daysUntil(dateStr);
  const formatted = new Date(dateStr + "T00:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  if (days < 0) return `Target: ${formatted} (overdue)`;
  if (days === 0) return `Target: ${formatted} (today)`;
  return `Target: ${formatted} (${days} days left)`;
}

function GoalRow({ goal, onDeposit, onEdit, onRemove }) {
  const [depositAmount, setDepositAmount] = useState("");
  const pct = goal.targetAmount > 0 ? Math.min(100, (goal.currentAmount / goal.targetAmount) * 100) : 0;
  const complete = pct >= 100;

  async function submitDeposit(e) {
    e.preventDefault();
    const amount = Number(depositAmount);
    if (!amount) return;
    await onDeposit(goal, amount);
    setDepositAmount("");
  }

  return (
    <li className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-sm font-medium text-slate-100">{goal.name}</p>
        <div className="flex shrink-0 items-center gap-2">
          <button onClick={() => onEdit(goal)} className="text-xs text-indigo-300 hover:text-indigo-200">
            Edit
          </button>
          <button onClick={() => onRemove(goal._id)} className="text-xs text-slate-500 hover:text-rose-400">
            ✕
          </button>
        </div>
      </div>

      <p className="mt-1 text-xs text-slate-400">
        {formatMoney(goal.currentAmount)} / {formatMoney(goal.targetAmount)}
      </p>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-all ${complete ? "bg-emerald-400" : "bg-indigo-400"}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-1.5 flex items-center justify-between text-xs">
        <span className={complete ? "text-emerald-300" : "text-slate-400"}>
          {pct.toFixed(0)}% complete
        </span>
        {goal.targetDate && <span className="text-slate-400">{targetDateLabel(goal.targetDate)}</span>}
      </div>

      <form onSubmit={submitDeposit} className="mt-2 flex gap-2">
        <input
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          type="number"
          step="0.01"
          placeholder="Add deposit..."
          className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-xs outline-none focus:border-indigo-400"
        />
        <button type="submit" className="shrink-0 rounded-lg bg-indigo-500 px-2.5 py-1 text-xs hover:bg-indigo-400">
          Deposit
        </button>
      </form>
    </li>
  );
}

const emptyForm = { name: "", targetAmount: "", currentAmount: "", targetDate: "" };

export default function SavingsGoals({ goals, onChange }) {
  const { token } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  function startAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(goal) {
    setForm({
      name: goal.name,
      targetAmount: String(goal.targetAmount),
      currentAmount: String(goal.currentAmount),
      targetDate: goal.targetDate || "",
    });
    setEditingId(goal._id);
    setShowForm(true);
  }

  function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function submit(e) {
    e.preventDefault();
    const payload = {
      name: form.name.trim() || "Savings Goal",
      targetAmount: Number(form.targetAmount) || 0,
      currentAmount: Number(form.currentAmount) || 0,
      targetDate: form.targetDate || "",
    };
    if (editingId) {
      await api.updateSavingsGoal(token, editingId, payload);
    } else {
      await api.createSavingsGoal(token, payload);
    }
    resetForm();
    onChange();
  }

  async function deposit(goal, amount) {
    await api.updateSavingsGoal(token, goal._id, { currentAmount: goal.currentAmount + amount });
    onChange();
  }

  async function remove(id) {
    await api.deleteSavingsGoal(token, id);
    onChange();
  }

  return (
    <GlassCard className="flex flex-col p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-200">Savings Goals</h2>
        <button onClick={startAdd} className="text-xs text-indigo-300 hover:text-indigo-200">
          + Add Goal
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="mt-3 space-y-2 rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Goal name (e.g. New Laptop)"
            className="w-full min-w-0 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm outline-none focus:border-indigo-400"
          />
          <div className="flex gap-2">
            <input
              value={form.targetAmount}
              onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
              type="number"
              step="0.01"
              placeholder="Target amount"
              className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-sm outline-none focus:border-indigo-400"
            />
            <input
              value={form.currentAmount}
              onChange={(e) => setForm({ ...form, currentAmount: e.target.value })}
              type="number"
              step="0.01"
              placeholder="Current amount"
              className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-sm outline-none focus:border-indigo-400"
            />
          </div>
          <input
            value={form.targetDate}
            onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
            type="date"
            min={toLocalDateString()}
            className="w-full min-w-0 rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-sm outline-none focus:border-indigo-400"
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

      <ul className="thin-scroll mt-3 max-h-[420px] space-y-3 overflow-y-auto">
        {goals.length === 0 && <li className="text-xs text-slate-400">No savings goals yet</li>}
        {goals.map((goal) => (
          <GoalRow key={goal._id} goal={goal} onDeposit={deposit} onEdit={startEdit} onRemove={remove} />
        ))}
      </ul>
    </GlassCard>
  );
}
