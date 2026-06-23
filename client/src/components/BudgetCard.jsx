import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GlassCard from "./GlassCard";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function BudgetCard() {
  const { token } = useAuth();
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    api.listAccounts(token).then(setAccounts).catch(() => setAccounts([]));
  }, [token]);

  const total = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <GlassCard
      as={Link}
      to="/budget"
      className="block p-5 transition hover:bg-white/15"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-200">Budget Management</h2>
        <span className="text-xs text-slate-400">View →</span>
      </div>

      {accounts.length === 0 ? (
        <p className="mt-3 text-xs text-slate-400">No accounts linked yet</p>
      ) : (
        <>
          <p className="mt-3 text-2xl font-semibold">
            ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <ul className="mt-2 space-y-1">
            {accounts.slice(0, 3).map((a) => (
              <li key={a._id} className="flex justify-between text-xs text-slate-300">
                <span>{a.bankName}</span>
                <span>${a.balance.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </GlassCard>
  );
}
