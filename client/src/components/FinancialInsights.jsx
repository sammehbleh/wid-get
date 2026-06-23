import { useState } from "react";
import GlassCard from "./GlassCard";
import { BUDGET_CATEGORIES } from "../data/budget";
import { buildInsights } from "../utils/insights";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const TYPE_STYLE = {
  warning: "border-rose-400/30 bg-rose-500/10 text-rose-200",
  positive: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
  info: "border-indigo-400/30 bg-indigo-500/10 text-indigo-200",
};

export default function FinancialInsights({ transactions, budgetLimits, onChange }) {
  const { token } = useAuth();
  const [category, setCategory] = useState(BUDGET_CATEGORIES[0]);
  const [limit, setLimit] = useState("");

  const insights = buildInsights(transactions, budgetLimits);

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
        <ul className="mt-2 space-y-1.5">
          {budgetLimits.length === 0 && (
            <li className="text-xs text-slate-400">No limits set yet</li>
          )}
          {budgetLimits.map((l) => (
            <li key={l._id} className="flex items-center justify-between text-xs text-slate-200">
              <span>{l.category}</span>
              <div className="flex items-center gap-2">
                <span>₱{l.limit.toLocaleString()}</span>
                <button onClick={() => removeLimit(l._id)} className="text-slate-500 hover:text-rose-400">
                  ✕
                </button>
              </div>
            </li>
          ))}
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
