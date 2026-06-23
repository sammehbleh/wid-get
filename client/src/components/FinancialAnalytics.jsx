import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import GlassCard from "./GlassCard";
import { buildMonthlySeries, buildWeeklySeries, categoryBreakdown, lastNMonths } from "../utils/insights";
import { useTheme } from "../context/ThemeContext";

const PIE_COLORS = ["#818cf8", "#34d399", "#fbbf24", "#f87171", "#60a5fa", "#c084fc", "#fb923c", "#4ade80", "#f472b6", "#94a3b8"];

function formatMoney(n) {
  return `₱${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

export default function FinancialAnalytics({ transactions }) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const axisColor = isLight ? "#57534e" : "#94a3b8";
  const gridColor = isLight ? "rgba(28,25,23,0.1)" : "rgba(255,255,255,0.08)";
  const tooltipStyle = {
    background: isLight ? "rgba(255, 255, 255, 0.95)" : "rgba(15, 23, 42, 0.9)",
    border: isLight ? "1px solid rgba(28,25,23,0.15)" : "1px solid rgba(255,255,255,0.15)",
    borderRadius: 8,
    fontSize: 12,
    color: isLight ? "#1c1917" : "#f1f5f9",
  };

  const months = lastNMonths(6);
  const monthly = buildMonthlySeries(transactions, months);
  const weekly = buildWeeklySeries(transactions, 8);
  const thisMonthCategories = categoryBreakdown(transactions, months[months.length - 1]);
  const highest = thisMonthCategories[0];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <GlassCard className="p-5">
        <h3 className="text-sm font-medium text-slate-200">Monthly Spending</h3>
        <div className="mt-3 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" stroke={axisColor} fontSize={12} />
              <YAxis stroke={axisColor} fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatMoney(v)} />
              <Bar dataKey="expense" fill="#818cf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <h3 className="text-sm font-medium text-slate-200">Income vs Expense</h3>
        <div className="mt-3 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" stroke={axisColor} fontSize={12} />
              <YAxis stroke={axisColor} fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatMoney(v)} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="income" name="Income" fill="#34d399" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <h3 className="text-sm font-medium text-slate-200">Spending by Category (this month)</h3>
        <div className="mt-3 h-56">
          {thisMonthCategories.length === 0 ? (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">
              No expenses logged this month
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={thisMonthCategories}
                  dataKey="total"
                  nameKey="category"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={2}
                >
                  {thisMonthCategories.map((entry, i) => (
                    <Cell key={entry.category} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatMoney(v)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <h3 className="text-sm font-medium text-slate-200">Weekly Spending Trend</h3>
        <div className="mt-3 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="week" stroke={axisColor} fontSize={12} />
              <YAxis stroke={axisColor} fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatMoney(v)} />
              <Line type="monotone" dataKey="expense" stroke="#818cf8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {highest && (
          <p className="mt-3 text-xs text-slate-400">
            Highest spending category this month:{" "}
            <span className="font-medium text-slate-200">
              {highest.category} ({formatMoney(highest.total)})
            </span>
          </p>
        )}
      </GlassCard>
    </div>
  );
}
