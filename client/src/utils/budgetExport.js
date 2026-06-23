import writeXlsxFile from "write-excel-file/browser";
import readXlsxFile from "read-excel-file/browser";
import { BUDGET_CATEGORIES } from "../data/budget";

const HEADERS = ["Date", "Category", "Description", "Income", "Expense", "Payment Source", "Notes"];

function toRows(transactions) {
  return transactions.map((t) => [
    t.date,
    t.category,
    t.description || "",
    t.income || 0,
    t.expense || 0,
    t.paymentSource || "",
    t.notes || "",
  ]);
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function csvEscape(value) {
  const str = String(value ?? "");
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportTransactionsCSV(transactions) {
  const lines = [HEADERS, ...toRows(transactions)].map((row) => row.map(csvEscape).join(","));
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, "wid-get-budget-tracker.csv");
}

export async function exportTransactionsExcel(transactions) {
  const headerRow = HEADERS.map((h) => ({ value: h, type: String, fontWeight: "bold" }));
  const dataRows = toRows(transactions).map((row) =>
    row.map((cell) => ({ value: cell, type: typeof cell === "number" ? Number : String }))
  );
  await writeXlsxFile([headerRow, ...dataRows]).toFile("wid-get-budget-tracker.xlsx");
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

function normalizeDate(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value || "").slice(0, 10);
}

function normalizeRow(cells) {
  const [date, category, description, income, expense, paymentSource, notes] = cells;
  return {
    date: normalizeDate(date),
    category: BUDGET_CATEGORIES.includes(category) ? category : "Other",
    description: description || "",
    income: Number(income) || 0,
    expense: Number(expense) || 0,
    paymentSource: paymentSource || "",
    notes: notes || "",
  };
}

export async function parseImportFile(file) {
  const isCsv = file.name.toLowerCase().endsWith(".csv");

  if (isCsv) {
    const text = await file.text();
    const rows = parseCSV(text);
    const [header, ...body] = rows;
    const looksLikeHeader = header && header[0]?.toLowerCase().includes("date");
    const dataRows = looksLikeHeader ? body : rows;
    return dataRows.map(normalizeRow);
  }

  const { rows } = await readXlsxFile(file);
  const [header, ...body] = rows;
  const looksLikeHeader = header && String(header[0]).toLowerCase().includes("date");
  const dataRows = looksLikeHeader ? body : rows;
  return dataRows.map(normalizeRow);
}
