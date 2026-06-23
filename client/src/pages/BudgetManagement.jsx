import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import BackgroundLayer from "../components/BackgroundLayer";
import BudgetSummary from "../components/BudgetSummary";
import AccountCard from "../components/AccountCard";
import BudgetTracker from "../components/BudgetTracker";
import SpendingInsights from "../components/SpendingInsights";
import { ACCOUNT_GROUPS } from "../data/accounts";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function BudgetManagement() {
  const { token } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    const [accountsData, transactionsData] = await Promise.all([
      api.listAccounts(token),
      api.listTransactions(token),
    ]);
    setAccounts(accountsData);
    setTransactions(transactionsData);
    setLoaded(true);
  }, [token]);

  useEffect(() => {
    refresh().catch(() => setLoaded(true));
  }, [refresh]);

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  const totalIncome = transactions.reduce((sum, t) => sum + (t.income || 0), 0);
  const totalExpenses = transactions.reduce((sum, t) => sum + (t.expense || 0), 0);
  const startingBalance = totalBalance - totalIncome + totalExpenses;
  const accountNames = accounts.map((a) => a.name);

  return (
    <div className="relative flex min-h-screen flex-col">
      <BackgroundLayer />
      <Navbar />

      <main className="flex w-full flex-1 flex-col gap-6 px-8 py-8">
        <h1 className="font-greeting text-3xl font-bold tracking-tight">Budget Management</h1>

        {loaded && (
          <>
            <BudgetSummary
              totalBalance={totalBalance}
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {ACCOUNT_GROUPS.map((group) => (
                <AccountCard
                  key={group.type}
                  type={group.type}
                  title={group.title}
                  accounts={accounts.filter((a) => a.type === group.type)}
                  onChange={refresh}
                />
              ))}
            </div>

            <BudgetTracker
              transactions={transactions}
              startingBalance={startingBalance}
              accountNames={accountNames}
              onChange={refresh}
            />

            <SpendingInsights />
          </>
        )}
      </main>
    </div>
  );
}
