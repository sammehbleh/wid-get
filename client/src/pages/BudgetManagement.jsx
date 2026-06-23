import Navbar from "../components/Navbar";
import BackgroundLayer from "../components/BackgroundLayer";
import GlassCard from "../components/GlassCard";

export default function BudgetManagement() {
  return (
    <div className="relative min-h-screen">
      <BackgroundLayer />
      <Navbar />

      <main className="mx-auto max-w-7xl px-8 py-8">
        <h1 className="text-2xl font-semibold">Budget Management</h1>

        <GlassCard className="mt-6 p-8 text-center text-slate-300">
          <p>This page is coming soon.</p>
          <p className="mt-1 text-sm text-slate-400">
            Full budget tracking, accounts, and spending insights will be built here.
          </p>
        </GlassCard>
      </main>
    </div>
  );
}
