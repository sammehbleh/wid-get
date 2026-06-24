import GlassCard from "../GlassCard";

function formatTime(ms) {
  const totalSeconds = Math.ceil(Math.max(0, ms) / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function CurrentFocusWidget({ task, timer }) {
  const totalMs =
    (timer.phase === "focus"
      ? timer.settings.focus
      : timer.phase === "short"
      ? timer.settings.shortBreak
      : timer.settings.longBreak) *
    60 *
    1000;
  const pct = Math.round((1 - timer.remainingMs / totalMs) * 100);

  return (
    <GlassCard className="p-5">
      <h2 className="text-xs font-medium uppercase tracking-wide text-slate-400">Current Focus</h2>
      <p className="mt-2 truncate text-sm font-medium text-slate-100">
        {task ? task.text : "No task selected"}
      </p>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <span>{formatTime(timer.remainingMs)} left</span>
        <span>{pct}%</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-indigo-400 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </GlassCard>
  );
}
