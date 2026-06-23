import { useEffect, useState } from "react";
import GlassCard from "./GlassCard";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { toLocalDateString } from "../utils/date";
import { processRecurringBills } from "../utils/recurring";

const FREQUENCIES = [
  { value: "none", label: "One-time" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

function frequencyLabel(value) {
  return FREQUENCIES.find((f) => f.value === value)?.label || "One-time";
}

function daysUntil(dueDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + "T00:00:00");
  return Math.round((due - today) / (1000 * 60 * 60 * 24));
}

function dueLabel(days) {
  if (days < 0) return `Overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"}`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} days`;
}

function groupBills(bills) {
  const overdue = [];
  const tomorrow = [];
  const thisWeek = [];
  for (const bill of bills) {
    const days = daysUntil(bill.dueDate);
    if (days < 0) overdue.push(bill);
    else if (days === 0 || days === 1) tomorrow.push(bill);
    else if (days <= 7) thisWeek.push(bill);
  }
  return { overdue, tomorrow, thisWeek };
}

function BillRow({ bill, onRemove }) {
  const days = daysUntil(bill.dueDate);
  return (
    <li className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm">
      <div className="min-w-0">
        <p className="truncate text-slate-100">
          {bill.name}
          {bill.frequency && bill.frequency !== "none" && (
            <span className="ml-1.5 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-1.5 py-0.5 text-[10px] text-indigo-300">
              {frequencyLabel(bill.frequency)}
            </span>
          )}
        </p>
        <p className={`text-xs ${days < 0 ? "text-rose-300" : "text-slate-400"}`}>
          {dueLabel(days)}
          {bill.amount > 0 && ` · ₱${bill.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
        </p>
      </div>
      <button onClick={() => onRemove(bill._id)} className="shrink-0 text-xs text-slate-500 hover:text-rose-400">
        ✕
      </button>
    </li>
  );
}

export default function UpcomingPayments({ bills, onChange }) {
  const { token } = useAuth();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState(toLocalDateString());
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("none");

  const { overdue, tomorrow, thisWeek } = groupBills(bills);

  useEffect(() => {
    if (bills.length === 0) return;
    processRecurringBills(token, bills).then((changed) => {
      if (changed) onChange();
    });
    // Re-run whenever the bill list itself changes (new/removed bills, or
    // a previous pass advancing a due date) — settles once nothing is due.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bills]);

  async function submit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    await api.createBill(token, { name: name.trim(), dueDate, amount: Number(amount) || 0, frequency });
    setName("");
    setAmount("");
    setFrequency("none");
    setAdding(false);
    onChange();
  }

  async function remove(id) {
    await api.deleteBill(token, id);
    onChange();
  }

  return (
    <GlassCard className="flex flex-col p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-200">Upcoming Payments</h2>
        <button
          onClick={() => setAdding((v) => !v)}
          className="text-xs text-indigo-300 hover:text-indigo-200"
        >
          {adding ? "Cancel" : "+ Add Bill"}
        </button>
      </div>

      {adding && (
        <form onSubmit={submit} className="mt-3 space-y-2 rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Bill name (e.g. Internet Bill)"
            className="w-full min-w-0 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm outline-none focus:border-indigo-400"
          />
          <div className="flex gap-2">
            <input
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              type="date"
              className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-sm outline-none focus:border-indigo-400"
            />
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              step="0.01"
              placeholder="Amount"
              className="w-28 min-w-0 rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-sm outline-none focus:border-indigo-400"
            />
          </div>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full min-w-0 rounded-lg border border-white/15 bg-white/10 px-2 py-1.5 text-sm text-slate-200 outline-none focus:border-indigo-400"
          >
            {FREQUENCIES.map((f) => (
              <option key={f.value} value={f.value} className="bg-slate-800">
                {f.label}
              </option>
            ))}
          </select>
          <button type="submit" className="rounded-lg bg-indigo-500 px-3 py-1.5 text-sm hover:bg-indigo-400">
            Add
          </button>
        </form>
      )}

      <div className="mt-3 space-y-4">
        {overdue.length === 0 && tomorrow.length === 0 && thisWeek.length === 0 && (
          <p className="text-xs text-slate-400">No upcoming payments — you're all caught up.</p>
        )}

        {overdue.length > 0 && (
          <div>
            <p className="text-xs font-medium text-rose-300">Overdue</p>
            <ul className="mt-1.5 space-y-1.5">
              {overdue.map((b) => (
                <BillRow key={b._id} bill={b} onRemove={remove} />
              ))}
            </ul>
          </div>
        )}

        {tomorrow.length > 0 && (
          <div>
            <p className="text-xs font-medium text-amber-300">Due Tomorrow</p>
            <ul className="mt-1.5 space-y-1.5">
              {tomorrow.map((b) => (
                <BillRow key={b._id} bill={b} onRemove={remove} />
              ))}
            </ul>
          </div>
        )}

        {thisWeek.length > 0 && (
          <div>
            <p className="text-xs font-medium text-slate-300">Due This Week</p>
            <ul className="mt-1.5 space-y-1.5">
              {thisWeek.map((b) => (
                <BillRow key={b._id} bill={b} onRemove={remove} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
