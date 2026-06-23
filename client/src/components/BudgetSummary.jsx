import GlassCard from "./GlassCard";

function formatMoney(n) {
  return `₱${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

export default function BudgetSummary({ totalBalance, totalIncome, totalExpenses }) {
  const remaining = totalBalance + totalIncome - totalExpenses;

  const stats = [
    { label: "Total Balance", value: totalBalance, tone: "text-slate-100" },
    { label: "Total Income", value: totalIncome, tone: "text-emerald-400" },
    { label: "Total Expenses", value: totalExpenses, tone: "text-rose-400" },
    { label: "Remaining Balance", value: remaining, tone: "text-indigo-300" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((s) => (
        <GlassCard key={s.label} className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{s.label}</p>
          <p className={`mt-2 text-2xl font-semibold ${s.tone}`}>{formatMoney(s.value)}</p>
        </GlassCard>
      ))}
    </div>
  );
}
