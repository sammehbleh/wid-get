import { useMemo, useState } from "react";
import GlassCard from "./GlassCard";
import { BUDGET_CATEGORIES } from "../data/budget";
import { buildInsights, categoryBreakdown, lastNMonths } from "../utils/insights";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const TYPE_STYLE = {
  warning: "border-rose-400/30 bg-rose-500/10 text-rose-200",
  positive: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
  info: "border-indigo-400/30 bg-indigo-500/10 text-indigo-200",
};

function formatMoney(n) {
  return `₱${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

function limitColors(pct) {
  if (pct > 90) return { bar: "bg-rose-400", text: "text-rose-300" };
  if (pct >= 70) return { bar: "bg-amber-400", text: "text-amber-300" };
  return { bar: "bg-emerald-400", text: "text-emerald-300" };
}

export default function FinancialInsights({ transactions, budgetLimits, onChange }) {
  const { token } = useAuth();
  const [category, setCategory] = useState(BUDGET_CATEGORIES[0]);
  const [limit, setLimit] = useState("");

  const insights = buildInsights(transactions, budgetLimits);

  const spentByCategory = useMemo(() => {
    const thisMonth = lastNMonths(1)[0];
    const breakdown = categoryBreakdown(transactions, thisMonth);
    return new Map(breakdown.map((b) => [b.category, b.total]));
  }, [transactions]);

  async function saveLimit(e) {
    e.preventDefault();
    const value = Number(limit) || 0;
    const existing = budgetLimits.find((l) => l.category === category);
    if (existing) {
      await api.updateBudgetLimit(token, existing._id, { category, limit: value });
    } else {
      await api.createBudgetLimit(token, { category, limit: value });
    }
    setLimit("");
    onChange();
  }

  async function removeLimit(id) {
    await api.deleteBudgetLimit(token, id);
    onChange();
  }

  return (
    <GlassCard className="flex flex-col p-5">
      <h2 className="text-sm font-medium text-slate-200">Financial Insights</h2>

      <ul className="mt-3 space-y-2">
        {insights.length === 0 && (
          <li className="text-xs text-slate-400">
            Not enough data yet — log a few transactions to see insights here.
          </li>
        )}
        {insights.map((insight, i) => (
          <li
            key={i}
            className={`rounded-lg border px-3 py-2 text-xs ${TYPE_STYLE[insight.type] || TYPE_STYLE.info}`}
          >
            {insight.text}
          </li>
        ))}
      </ul>

      <div className="mt-4 border-t border-white/10 pt-3">
        <p className="text-xs font-medium text-slate-300">Budget Limits</p>
        <ul className="mt-2 space-y-3">
          {budgetLimits.length === 0 && (
            <li className="text-xs text-slate-400">No limits set yet</li>
          )}
          {budgetLimits.map((l) => {
            const used = spentByCategory.get(l.category) || 0;
            const remaining = l.limit - used;
            const pct = l.limit > 0 ? Math.min(100, (used / l.limit) * 100) : 0;
            const colors = limitColors(l.limit > 0 ? (used / l.limit) * 100 : 0);
            return (
              <li key={l._id} className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200">{l.category}</span>
                  <button onClick={() => removeLimit(l._id)} className="text-slate-500 hover:text-rose-400">
                    ✕
                  </button>
                </div>

                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full transition-all ${colors.bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>
                    Used {formatMoney(used)} of {formatMoney(l.limit)}
                  </span>
                  <span className={colors.text}>
                    {remaining >= 0 ? `${formatMoney(remaining)} left` : `${formatMoney(-remaining)} over`}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        <form onSubmit={saveLimit} className="mt-2 flex gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/10 px-2 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-400"
          >
            {BUDGET_CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-slate-800">
                {c}
              </option>
            ))}
          </select>
          <input
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            type="number"
            step="0.01"
            placeholder="Limit"
            className="w-24 min-w-0 rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-xs outline-none focus:border-indigo-400"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-indigo-500 px-3 py-1.5 text-xs hover:bg-indigo-400"
          >
            Set
          </button>
        </form>
      </div>
    </GlassCard>
  );
}
