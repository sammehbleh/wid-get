import { useMemo, useState } from "react";
import GlassCard from "./GlassCard";
import { BUDGET_CATEGORIES } from "../data/budget";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

function formatMoney(n) {
  return `₱${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

const emptyForm = {
  date: new Date().toISOString().slice(0, 10),
  category: "Other",
  description: "",
  income: "",
  expense: "",
  paymentSource: "",
  notes: "",
};

export default function BudgetTracker({ transactions, startingBalance, accountNames, onChange }) {
  const { token } = useAuth();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("");
  const [category, setCategory] = useState("All");
  const [kind, setKind] = useState("All");
  const [sortBy, setSortBy] = useState("date-desc");

  // Remaining balance is a property of chronological order, independent of
  // whatever filter/sort the table is currently displaying.
  const remainingById = useMemo(() => {
    const chronological = [...transactions].sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? -1 : 1;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
    let running = startingBalance;
    const map = new Map();
    for (const t of chronological) {
      running += (t.income || 0) - (t.expense || 0);
      map.set(t._id, running);
    }
    return map;
  }, [transactions, startingBalance]);

  const visible = useMemo(() => {
    let rows = transactions.filter((t) => {
      if (month && !t.date.startsWith(month)) return false;
      if (category !== "All" && t.category !== category) return false;
      if (kind === "Income" && !(t.income > 0)) return false;
      if (kind === "Expense" && !(t.expense > 0)) return false;
      if (search) {
        const haystack = `${t.description} ${t.notes} ${t.paymentSource} ${t.category}`.toLowerCase();
        if (!haystack.includes(search.toLowerCase())) return false;
      }
      return true;
    });

    rows = [...rows].sort((a, b) => {
      if (sortBy === "date-desc") return a.date < b.date ? 1 : -1;
      if (sortBy === "date-asc") return a.date < b.date ? -1 : 1;
      const netA = (a.income || 0) - (a.expense || 0);
      const netB = (b.income || 0) - (b.expense || 0);
      return sortBy === "amount-desc" ? netB - netA : netA - netB;
    });

    return rows;
  }, [transactions, month, category, kind, search, sortBy]);

  function resetForm() {
    setAdding(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function startAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setAdding(true);
  }

  function startEdit(t) {
    setForm({
      date: t.date,
      category: t.category,
      description: t.description,
      income: t.income || "",
      expense: t.expense || "",
      paymentSource: t.paymentSource,
      notes: t.notes,
    });
    setAdding(false);
    setEditingId(t._id);
  }

  async function submit(e) {
    e.preventDefault();
    const payload = {
      date: form.date,
      category: form.category,
      description: form.description.trim(),
      income: Number(form.income) || 0,
      expense: Number(form.expense) || 0,
      paymentSource: form.paymentSource.trim(),
      notes: form.notes.trim(),
    };
    if (editingId) {
      await api.updateTransaction(token, editingId, payload);
    } else {
      await api.createTransaction(token, payload);
    }
    resetForm();
    onChange();
  }

  async function remove(id) {
    await api.deleteTransaction(token, id);
    onChange();
  }

  const totalIncome = transactions.reduce((s, t) => s + (t.income || 0), 0);
  const totalExpense = transactions.reduce((s, t) => s + (t.expense || 0), 0);

  return (
    <GlassCard className="flex flex-col p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-slate-200">Budget Tracker</h2>
        <button
          onClick={startAdd}
          className="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-medium hover:bg-indigo-400"
        >
          + Add Entry
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="min-w-[140px] flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm outline-none focus:border-indigo-400"
        />
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-lg border border-white/15 bg-white/10 px-2 py-1.5 text-sm text-slate-200 outline-none focus:border-indigo-400"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-white/15 bg-white/10 px-2 py-1.5 text-sm text-slate-200 outline-none focus:border-indigo-400"
        >
          <option className="bg-slate-800">All</option>
          {BUDGET_CATEGORIES.map((c) => (
            <option key={c} value={c} className="bg-slate-800">
              {c}
            </option>
          ))}
        </select>
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          className="rounded-lg border border-white/15 bg-white/10 px-2 py-1.5 text-sm text-slate-200 outline-none focus:border-indigo-400"
        >
          <option className="bg-slate-800">All</option>
          <option value="Income" className="bg-slate-800">Income only</option>
          <option value="Expense" className="bg-slate-800">Expense only</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg border border-white/15 bg-white/10 px-2 py-1.5 text-sm text-slate-200 outline-none focus:border-indigo-400"
        >
          <option value="date-desc" className="bg-slate-800">Newest first</option>
          <option value="date-asc" className="bg-slate-800">Oldest first</option>
          <option value="amount-desc" className="bg-slate-800">Amount: high to low</option>
          <option value="amount-asc" className="bg-slate-800">Amount: low to high</option>
        </select>
      </div>

      {(adding || editingId) && (
        <form
          onSubmit={submit}
          className="mt-3 grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-3 lg:grid-cols-4"
        >
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-sm outline-none focus:border-indigo-400"
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="rounded-lg border border-white/15 bg-white/10 px-2 py-1.5 text-sm text-slate-200 outline-none focus:border-indigo-400"
          >
            {BUDGET_CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-slate-800">
                {c}
              </option>
            ))}
          </select>
          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            className="col-span-2 rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-sm outline-none focus:border-indigo-400 lg:col-span-1"
          />
          <input
            type="number"
            step="0.01"
            value={form.income}
            onChange={(e) => setForm({ ...form, income: e.target.value })}
            placeholder="Income"
            className="rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-sm outline-none focus:border-indigo-400"
          />
          <input
            type="number"
            step="0.01"
            value={form.expense}
            onChange={(e) => setForm({ ...form, expense: e.target.value })}
            placeholder="Expense"
            className="rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-sm outline-none focus:border-indigo-400"
          />
          <input
            list="payment-sources"
            value={form.paymentSource}
            onChange={(e) => setForm({ ...form, paymentSource: e.target.value })}
            placeholder="Payment source"
            className="rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-sm outline-none focus:border-indigo-400"
          />
          <datalist id="payment-sources">
            {accountNames.map((n) => (
              <option key={n} value={n} />
            ))}
          </datalist>
          <input
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Notes"
            className="rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-sm outline-none focus:border-indigo-400"
          />
          <div className="col-span-2 flex gap-2 lg:col-span-4">
            <button
              type="submit"
              className="rounded-lg bg-indigo-500 px-3 py-1.5 text-sm hover:bg-indigo-400"
            >
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

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-400">
              <th className="py-2 pr-3 font-medium">Date</th>
              <th className="py-2 pr-3 font-medium">Category</th>
              <th className="py-2 pr-3 font-medium">Description</th>
              <th className="py-2 pr-3 font-medium">Income</th>
              <th className="py-2 pr-3 font-medium">Expense</th>
              <th className="py-2 pr-3 font-medium">Source</th>
              <th className="py-2 pr-3 font-medium">Remaining</th>
              <th className="py-2 pr-3 font-medium">Notes</th>
              <th className="py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td colSpan={9} className="py-4 text-center text-xs text-slate-400">
                  No entries yet
                </td>
              </tr>
            )}
            {visible.map((t) => (
              <tr key={t._id} className="border-b border-white/5 text-slate-200">
                <td className="py-2 pr-3 whitespace-nowrap">{t.date}</td>
                <td className="py-2 pr-3">
                  <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-xs">
                    {t.category}
                  </span>
                </td>
                <td className="py-2 pr-3 max-w-[180px] truncate">{t.description || "—"}</td>
                <td className="py-2 pr-3 text-emerald-400">
                  {t.income ? formatMoney(t.income) : "—"}
                </td>
                <td className="py-2 pr-3 text-rose-400">
                  {t.expense ? formatMoney(t.expense) : "—"}
                </td>
                <td className="py-2 pr-3 max-w-[120px] truncate">{t.paymentSource || "—"}</td>
                <td className="py-2 pr-3 font-medium whitespace-nowrap">
                  {formatMoney(remainingById.get(t._id))}
                </td>
                <td className="py-2 pr-3 max-w-[140px] truncate text-slate-400">{t.notes || "—"}</td>
                <td className="py-2 whitespace-nowrap text-right">
                  <button
                    onClick={() => startEdit(t)}
                    className="mr-2 text-xs text-indigo-300 hover:text-indigo-200"
                  >
                    Edit
                  </button>
                  <button onClick={() => remove(t._id)} className="text-xs text-slate-500 hover:text-rose-400">
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          {visible.length > 0 && (
            <tfoot>
              <tr className="text-sm font-medium text-slate-100">
                <td className="pt-3" colSpan={3}>
                  Totals ({visible.length} shown)
                </td>
                <td className="pt-3 text-emerald-400">{formatMoney(totalIncome)}</td>
                <td className="pt-3 text-rose-400">{formatMoney(totalExpense)}</td>
                <td className="pt-3" colSpan={4} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </GlassCard>
  );
}
