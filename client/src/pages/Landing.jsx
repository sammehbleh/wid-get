import { Link } from "react-router-dom";
import LandingBackground from "../components/LandingBackground";
import Logo from "../components/Logo";
import GlassCard from "../components/GlassCard";
import { useAuth } from "../context/AuthContext";

function Icon({ path, className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {path}
    </svg>
  );
}

const FEATURES = [
  {
    title: "Notepad",
    description: "Quick notes sorted into Personal, Work, School, Finance and more.",
    icon: <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM14 3v4h4M9 13h6M9 17h6" />,
  },
  {
    title: "Budget Tracker",
    description: "Accounts, transactions, spending insights, and budget limits in one place.",
    icon: <path d="M3 7h18v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7zM3 7l2-3h14l2 3M16 13h2" />,
  },
  {
    title: "Calendar Planner",
    description: "Click any day to log events with a name, time, and place.",
    icon: <path d="M5 4h14a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM4 9h16M8 2v4M16 2v4" />,
  },
  {
    title: "To-Do List",
    description: "Color-coded priorities, and tasks that can auto-log an expense when done.",
    icon: <path d="M4 6h2M4 12h2M4 18h2M9 6h11M9 12h11M9 18h11" />,
  },
  {
    title: "Savings Goals",
    description: "Track progress toward a target with deposits and a target date.",
    icon: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />,
  },
  {
    title: "Make it yours",
    description: "Drag widgets around, hide what you don't use, switch dark/light/auto theme.",
    icon: <path d="M4 6h16M4 12h16M4 18h16M8 4v4M14 10v4M9 16v4" />,
  },
];

export default function Landing() {
  const { token } = useAuth();

  return (
    <div className="relative flex min-h-screen flex-col">
      <LandingBackground />

      <header className="flex items-center justify-between px-6 py-6 sm:px-10">
        <Logo size="lg" />
        {!token && (
          <Link to="/login" className="text-sm text-slate-200/80 hover:text-white">
            Log in
          </Link>
        )}
      </header>

      <main className="flex flex-1 flex-col items-center px-6 pb-20 pt-12 sm:px-10">
        <div className="max-w-3xl text-center">
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-wide text-indigo-200">
            Personal productivity, reimagined
          </span>
          <h1 className="font-greeting mt-6 text-5xl font-bold tracking-tight text-white sm:text-6xl">
            Your day, organized
            <br />
            into <span className="text-indigo-300">widgets</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-300">
            Wid+get brings your notes, budget, calendar, and to-dos into one
            clean dashboard — arrange it however you like, and pick up right
            where you left off.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            {token ? (
              <Link
                to="/dashboard"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-500/40 transition-transform duration-300 hover:scale-[1.03]"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-[120%] -skew-x-12 bg-white/25 transition-transform duration-700 group-hover:translate-x-[120%]" />
                <Icon
                  className="h-5 w-5"
                  path={<path d="M4 13h6V4H4v9zM14 20h6v-9h-6v9zM4 20h6v-4H4v4zM14 9h6V4h-6v5" />}
                />
                Go to your Dashboard
                <Icon className="h-4 w-4 transition-transform group-hover:translate-x-1" path={<path d="M5 12h14M13 6l6 6-6 6" />} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400"
                >
                  Get Started — it's free
                </Link>
                <Link
                  to="/login"
                  className="rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-slate-100 hover:bg-white/10"
                >
                  I already have an account
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="mt-20 grid w-full max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <GlassCard key={f.title} className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                <Icon path={f.icon} />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-white">{f.title}</h3>
              <p className="mt-1 text-sm text-slate-300">{f.description}</p>
            </GlassCard>
          ))}
        </div>
      </main>

      <footer className="px-6 pb-8 text-center text-xs text-slate-400 sm:px-10">
        <p>Wid+get — get your widgets, get things done.</p>
        <p className="mt-1">© {new Date().getFullYear()} All rights reserved. Samantha Jumuad.</p>
      </footer>
    </div>
  );
}
