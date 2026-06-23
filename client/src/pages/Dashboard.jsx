import { useMemo } from "react";
import Navbar from "../components/Navbar";
import BackgroundLayer from "../components/BackgroundLayer";
import BudgetCard from "../components/BudgetCard";
import ReminderCard from "../components/ReminderCard";
import Notepad from "../components/Notepad";
import MiniCalendar from "../components/MiniCalendar";
import TodoList from "../components/TodoList";
import MusicRecommendation from "../components/MusicRecommendation";
import { randomQuote } from "../data/quotes";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const quote = useMemo(randomQuote, []);
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="relative flex min-h-screen flex-col">
      <BackgroundLayer />
      <Navbar />

      <main className="flex w-full flex-1 flex-col px-8 py-8">
        <header className="mb-10 flex items-center justify-between gap-6">
          <div>
            <h1 className="font-greeting text-5xl font-bold tracking-tight lg:text-6xl">
              Welcome back, {firstName}!
            </h1>
            <p className="mt-4 max-w-2xl text-lg italic text-slate-300 lg:text-xl">
              "{quote}"
            </p>
          </div>
          <MusicRecommendation className="w-full max-w-xs shrink-0 lg:w-80" />
        </header>

        <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[320px_1fr_320px]">
          <div className="flex h-full min-h-0 flex-col gap-6">
            <BudgetCard />
            <ReminderCard className="min-h-0 flex-1" />
          </div>

          <div className="h-full min-h-0">
            <Notepad />
          </div>

          <div className="flex h-full min-h-0 flex-col gap-6">
            <MiniCalendar />
            <TodoList className="min-h-0 flex-1" />
          </div>
        </div>
      </main>
    </div>
  );
}
