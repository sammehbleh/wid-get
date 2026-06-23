import { useState } from "react";
import GlassCard from "./GlassCard";
import ProviderBadge from "./ProviderBadge";
import { PROVIDERS } from "../data/accounts";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

function formatMoney(n) {
  return `₱${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

export default function AccountCard({ type, title, accounts, onChange }) {
  const { token } = useAuth();
  const providers = PROVIDERS[type];
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [provider, setProvider] = useState(providers[0].id);
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");

  const total = accounts.reduce((sum, a) => sum + a.balance, 0);

  function resetForm() {
    setAdding(false);
    setEditingId(null);
    setProvider(providers[0].id);
    setName("");
    setBalance("");
  }

  function startAdd() {
    resetForm();
    setAdding(true);
  }

  function startEdit(account) {
    resetForm();
    setEditingId(account._id);
    setProvider(account.provider);
    setName(account.name);
    setBalance(String(account.balance));
  }

  async function submit(e) {
    e.preventDefault();
    const payload = {
      type,
      provider,
      name: name.trim() || providers.find((p) => p.id === provider)?.label || "Account",
      balance: Number(balance) || 0,
    };
    if (editingId) {
      await api.updateAccount(token, editingId, payload);
    } else {
      await api.createAccount(token, payload);
    }
    resetForm();
    onChange();
  }

  async function remove(id) {
    await api.deleteAccount(token, id);
    onChange();
  }

  const showForm = adding || editingId;

  return (
    <GlassCard className="flex flex-col p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-200">{title}</h2>
        <span className="text-sm font-semibold text-slate-100">{formatMoney(total)}</span>
      </div>

      <ul className="mt-3 space-y-2">
        {accounts.length === 0 && <li className="text-xs text-slate-400">No accounts yet</li>}
        {accounts.map((a) => (
          <li
            key={a._id}
            className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-2"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <ProviderBadge type={type} provider={a.provider} />
              <div className="min-w-0">
                <p className="truncate text-sm text-slate-100">{a.name}</p>
                <p className="text-xs text-slate-400">{formatMoney(a.balance)}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => startEdit(a)}
                className="text-xs text-indigo-300 hover:text-indigo-200"
              >
                Edit
              </button>
              <button onClick={() => remove(a._id)} className="text-xs text-slate-500 hover:text-rose-400">
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showForm ? (
        <form onSubmit={submit} className="mt-3 space-y-2 rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <div className="flex gap-2">
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/10 px-2 py-1.5 text-sm text-slate-200 outline-none focus:border-indigo-400"
            >
              {providers.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-800">
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Account name (optional)"
            className="w-full min-w-0 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm outline-none focus:border-indigo-400"
          />
          <input
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            type="number"
            step="0.01"
            placeholder="Balance"
            className="w-full min-w-0 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm outline-none focus:border-indigo-400"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-indigo-500 px-3 py-1.5 text-sm hover:bg-indigo-400"
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
      ) : (
        <button
          onClick={startAdd}
          className="mt-3 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/10"
        >
          + Add Account
        </button>
      )}
    </GlassCard>
  );
}
