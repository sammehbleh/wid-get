export const ACCOUNT_GROUPS = [
  { type: "bank", title: "E-Wallet / Bank Accounts" },
  { type: "credit", title: "Credit Card Accounts" },
  { type: "cash", title: "Physical Cash / Wallet" },
];

export const PROVIDERS = {
  bank: [
    { id: "gcash", label: "GCash", initials: "GC", color: "#0072CE" },
    { id: "maya", label: "Maya", initials: "MY", color: "#5BE49B" },
    { id: "bdo", label: "BDO", initials: "BDO", color: "#0033A0" },
    { id: "bpi", label: "BPI", initials: "BPI", color: "#C8102E" },
    { id: "metrobank", label: "Metrobank", initials: "MB", color: "#003DA5" },
    { id: "unionbank", label: "UnionBank", initials: "UB", color: "#F47920" },
    { id: "landbank", label: "Landbank", initials: "LB", color: "#00712D" },
    { id: "other", label: "Other Bank", initials: "B", color: "#64748b" },
  ],
  credit: [
    { id: "visa", label: "Visa", initials: "VI", color: "#1A1F71" },
    { id: "mastercard", label: "Mastercard", initials: "MC", color: "#EB001B" },
    { id: "amex", label: "Amex", initials: "AE", color: "#2671B9" },
    { id: "other", label: "Other Card", initials: "CC", color: "#64748b" },
  ],
  cash: [
    { id: "cash", label: "Cash Wallet", initials: "₱", color: "#22A06B" },
    { id: "other", label: "Other", initials: "C", color: "#64748b" },
  ],
};

export function providerMeta(type, providerId) {
  const list = PROVIDERS[type] || PROVIDERS.bank;
  return list.find((p) => p.id === providerId) || list[list.length - 1];
}
