import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import BackgroundLayer from "../components/BackgroundLayer";
import BudgetSummary from "../components/BudgetSummary";
import AccountCard from "../components/AccountCard";
import BudgetTracker from "../components/BudgetTracker";
import FinancialAnalytics from "../components/FinancialAnalytics";
import FinancialInsights from "../components/FinancialInsights";
import UpcomingPayments from "../components/UpcomingPayments";
import SavingsGoals from "../components/SavingsGoals";
import { ACCOUNT_GROUPS } from "../data/accounts";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function BudgetManagement() {
  const { token } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgetLimits, setBudgetLimits] = useState([]);
  const [bills, setBills] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    const [accountsData, transactionsData, budgetLimitsData, billsData, savingsGoalsData] = await Promise.all([
      api.listAccounts(token),
      api.listTransactions(token),
      api.listBudgetLimits(token),
      api.listBills(token),
      api.listSavingsGoals(token),
    ]);
    setAccounts(accountsData);
    setTransactions(transactionsData);
    setBudgetLimits(budgetLimitsData);
    setBills(billsData);
    setSavingsGoals(savingsGoalsData);
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

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <FinancialInsights
                transactions={transactions}
                budgetLimits={budgetLimits}
                onChange={refresh}
              />
              <UpcomingPayments bills={bills} onChange={refresh} />
              <SavingsGoals goals={savingsGoals} onChange={refresh} />
            </div>

            <FinancialAnalytics transactions={transactions} />
          </>
        )}
      </main>
    </div>
  );
}
