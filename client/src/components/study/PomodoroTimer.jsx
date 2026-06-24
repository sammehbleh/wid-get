import { useState } from "react";
import GlassCard from "../GlassCard";

const PHASE_LABEL = { focus: "Focus Session", short: "Short Break", long: "Long Break" };
const PHASE_RING = { focus: "stroke-indigo-400", short: "stroke-emerald-400", long: "stroke-sky-400" };

function formatTime(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function PomodoroTimer({ timer, currentTaskText, compact = false }) {
  const [showSettings, setShowSettings] = useState(false);

  const totalMs =
    (timer.phase === "focus"
      ? timer.settings.focus
      : timer.phase === "short"
      ? timer.settings.shortBreak
      : timer.settings.longBreak) *
    60 *
    1000;
  const progress = 1 - timer.remainingMs / totalMs;
  const circumference = 2 * Math.PI * 88;

  return (
    <GlassCard className={`flex flex-col items-center p-6 ${compact ? "" : ""}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{PHASE_LABEL[timer.phase]}</p>
      {currentTaskText && (
        <p className="mt-1 max-w-xs truncate text-center text-xs text-indigo-300">{currentTaskText}</p>
      )}

      <div className="relative mt-4 h-48 w-48">
        <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
          <circle cx="100" cy="100" r="88" fill="none" strokeWidth="10" className="stroke-white/10" />
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            className={`${PHASE_RING[timer.phase]} transition-all duration-300`}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-greeting text-4xl font-bold tabular-nums text-white">
            {formatTime(timer.remainingMs)}
          </span>
          <span className="mt-1 text-xs text-slate-400">Session {timer.sessionNumber}</span>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        {!timer.running ? (
          <button
            onClick={timer.start}
            className="rounded-lg bg-indigo-500 px-5 py-2 text-sm font-medium hover:bg-indigo-400"
          >
            {timer.remainingMs < totalMs ? "Resume" : "Start"}
          </button>
        ) : (
          <button
            onClick={timer.pause}
            className="rounded-lg bg-indigo-500 px-5 py-2 text-sm font-medium hover:bg-indigo-400"
          >
            Pause
          </button>
        )}
        <button
          onClick={timer.reset}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
        >
          Reset
        </button>
        <button
          onClick={timer.skip}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
        >
          Skip
        </button>
      </div>

      <div className="mt-4 grid w-full grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-sm font-semibold text-slate-100">{timer.sessionNumber}</p>
          <p className="text-[10px] text-slate-400">Session</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-100">{timer.completedSessionsToday}</p>
          <p className="text-[10px] text-slate-400">Done today</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-100">{timer.totalStudyMinutesToday}m</p>
          <p className="text-[10px] text-slate-400">Today</p>
        </div>
      </div>

      <button
        onClick={() => setShowSettings((v) => !v)}
        className="mt-4 text-xs text-slate-400 hover:text-slate-200"
      >
        {showSettings ? "Hide settings" : "Timer settings"}
      </button>

      {showSettings && (
        <div className="mt-3 grid w-full grid-cols-2 gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-xs">
          <label className="flex flex-col gap-1 text-slate-400">
            Focus (min)
            <input
              type="number"
              min="1"
              value={timer.settings.focus}
              onChange={(e) => timer.updateSettings({ focus: Number(e.target.value) || 1 })}
              className="rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-slate-100 outline-none focus:border-indigo-400"
            />
          </label>
          <label className="flex flex-col gap-1 text-slate-400">
            Short break (min)
            <input
              type="number"
              min="1"
              value={timer.settings.shortBreak}
              onChange={(e) => timer.updateSettings({ shortBreak: Number(e.target.value) || 1 })}
              className="rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-slate-100 outline-none focus:border-indigo-400"
            />
          </label>
          <label className="flex flex-col gap-1 text-slate-400">
            Long break (min)
            <input
              type="number"
              min="1"
              value={timer.settings.longBreak}
              onChange={(e) => timer.updateSettings({ longBreak: Number(e.target.value) || 1 })}
              className="rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-slate-100 outline-none focus:border-indigo-400"
            />
          </label>
          <label className="flex flex-col gap-1 text-slate-400">
            Sessions / long break
            <input
              type="number"
              min="1"
              value={timer.settings.sessionsBeforeLong}
              onChange={(e) => timer.updateSettings({ sessionsBeforeLong: Number(e.target.value) || 1 })}
              className="rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-slate-100 outline-none focus:border-indigo-400"
            />
          </label>
        </div>
      )}
    </GlassCard>
  );
}
