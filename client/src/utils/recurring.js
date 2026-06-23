import { toLocalDateString } from "./date";
import { api } from "../api/client";

export function advanceDueDate(dateStr, frequency) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  if (frequency === "weekly") date.setDate(date.getDate() + 7);
  else if (frequency === "monthly") date.setMonth(date.getMonth() + 1);
  else if (frequency === "yearly") date.setFullYear(date.getFullYear() + 1);
  return toLocalDateString(date);
}

function daysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr + "T00:00:00");
  return Math.round((due - today) / (1000 * 60 * 60 * 24));
}

function reminderText(name, days, amount) {
  const when = days === 0 ? "today" : days === 1 ? "tomorrow" : `in ${days} days`;
  const amountSuffix = amount > 0 ? ` (₱${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })})` : "";
  return `${name} is due ${when}${amountSuffix}`;
}

const REMINDER_WINDOW_DAYS = 3;

// Rolls each recurring bill's due date forward past "today" if it has
// lapsed, and queues a Reminder once a bill enters the due-soon window.
// Runs on every bills load (there's no background scheduler), so it's
// idempotent: a bill only gets touched once per due date.
export async function processRecurringBills(token, bills) {
  let didChange = false;

  for (const bill of bills) {
    let dueDate = bill.dueDate;

    if (bill.frequency && bill.frequency !== "none") {
      while (daysUntil(dueDate) < 0) {
        dueDate = advanceDueDate(dueDate, bill.frequency);
      }
    }

    const days = daysUntil(dueDate);
    const needsReminder = days >= 0 && days <= REMINDER_WINDOW_DAYS && bill.reminderSentFor !== dueDate;
    const dateAdvanced = dueDate !== bill.dueDate;

    if (!needsReminder && !dateAdvanced) continue;

    if (needsReminder) {
      await api.createReminder(token, { text: reminderText(bill.name, days, bill.amount) });
    }

    await api.updateBill(token, bill._id, {
      dueDate,
      reminderSentFor: needsReminder ? dueDate : bill.reminderSentFor,
    });
    didChange = true;
  }

  return didChange;
}
