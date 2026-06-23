import { toLocalDateString } from "./date";

function monthKey(date) {
  return date.slice(0, 7); // "YYYY-MM"
}

function shiftMonth(key, delta) {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function lastNMonths(n, from = new Date()) {
  const base = `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, "0")}`;
  const months = [];
  for (let i = n - 1; i >= 0; i--) months.push(shiftMonth(base, -i));
  return months;
}

export function monthLabel(key) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleString(undefined, { month: "short" });
}

export function buildMonthlySeries(transactions, months) {
  return months.map((key) => {
    const rows = transactions.filter((t) => monthKey(t.date) === key);
    return {
      month: monthLabel(key),
      key,
      income: rows.reduce((s, t) => s + (t.income || 0), 0),
      expense: rows.reduce((s, t) => s + (t.expense || 0), 0),
    };
  });
}

export function categoryBreakdown(transactions, monthFilter) {
  const rows = monthFilter ? transactions.filter((t) => monthKey(t.date) === monthFilter) : transactions;
  const totals = new Map();
  for (const t of rows) {
    if (!t.expense) continue;
    totals.set(t.category, (totals.get(t.category) || 0) + t.expense);
  }
  return [...totals.entries()].map(([category, total]) => ({ category, total })).sort((a, b) => b.total - a.total);
}

function lastNWeeks(n, from = new Date()) {
  const weeks = [];
  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() - cursor.getDay()); // back to this week's Sunday
  for (let i = n - 1; i >= 0; i--) {
    const start = new Date(cursor);
    start.setDate(start.getDate() - i * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    weeks.push({ start, end });
  }
  return weeks;
}

export function buildWeeklySeries(transactions, weekCount = 8) {
  const weeks = lastNWeeks(weekCount);
  return weeks.map(({ start, end }) => {
    const startStr = toLocalDateString(start);
    const endStr = toLocalDateString(end);
    const rows = transactions.filter((t) => t.date >= startStr && t.date <= endStr);
    return {
      week: `${start.getMonth() + 1}/${start.getDate()}`,
      expense: rows.reduce((s, t) => s + (t.expense || 0), 0),
    };
  });
}

function pctChange(current, previous) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
}

export function buildInsights(transactions, budgetLimits) {
  const insights = [];
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const lastMonth = shiftMonth(thisMonth, -1);

  const thisMonthCats = new Map();
  const lastMonthCats = new Map();
  let thisMonthIncome = 0,
    thisMonthExpense = 0,
    lastMonthIncome = 0,
    lastMonthExpense = 0;

  for (const t of transactions) {
    const key = monthKey(t.date);
    if (key === thisMonth) {
      thisMonthIncome += t.income || 0;
      thisMonthExpense += t.expense || 0;
      if (t.expense) thisMonthCats.set(t.category, (thisMonthCats.get(t.category) || 0) + t.expense);
    } else if (key === lastMonth) {
      lastMonthIncome += t.income || 0;
      lastMonthExpense += t.expense || 0;
      if (t.expense) lastMonthCats.set(t.category, (lastMonthCats.get(t.category) || 0) + t.expense);
    }
  }

  // Category month-over-month changes
  for (const [category, current] of thisMonthCats) {
    const previous = lastMonthCats.get(category) || 0;
    const change = pctChange(current, previous);
    if (previous > 0 && Math.abs(change) >= 15) {
      const direction = change > 0 ? "increased" : "decreased";
      insights.push({
        type: change > 0 ? "warning" : "positive",
        text: `${category} spending ${direction} ${Math.abs(Math.round(change))}% compared to last month.`,
      });
    }
  }

  // Budget limit warnings
  for (const limit of budgetLimits) {
    const spent = thisMonthCats.get(limit.category) || 0;
    if (limit.limit <= 0) continue;
    const ratio = spent / limit.limit;
    if (ratio >= 1) {
      insights.push({
        type: "warning",
        text: `You've gone over your ${limit.category} budget limit (₱${spent.toLocaleString()} of ₱${limit.limit.toLocaleString()}).`,
      });
    } else if (ratio >= 0.8) {
      insights.push({
        type: "warning",
        text: `You are close to your ${limit.category} budget limit (₱${spent.toLocaleString()} of ₱${limit.limit.toLocaleString()}).`,
      });
    }
  }

  // Savings (net income - expense) change
  const thisSavings = thisMonthIncome - thisMonthExpense;
  const lastSavings = lastMonthIncome - lastMonthExpense;
  const savingsDelta = thisSavings - lastSavings;
  if (Math.abs(savingsDelta) >= 1) {
    insights.push({
      type: savingsDelta > 0 ? "positive" : "warning",
      text: `Savings ${savingsDelta > 0 ? "increased" : "decreased"} by ₱${Math.abs(savingsDelta).toLocaleString(undefined, { minimumFractionDigits: 2 })} this month.`,
    });
  }

  // Highest spending category
  const highest = [...thisMonthCats.entries()].sort((a, b) => b[1] - a[1])[0];
  if (highest) {
    insights.push({
      type: "info",
      text: `Highest spending category this month: ${highest[0]} (₱${highest[1].toLocaleString(undefined, { minimumFractionDigits: 2 })}).`,
    });
  }

  return insights;
}

export function highestSpendingCategory(transactions) {
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const breakdown = categoryBreakdown(transactions, thisMonth);
  return breakdown[0] || null;
}
