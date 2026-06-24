import GlassCard from "../GlassCard";

export default function StudyStats({ timer, completedTaskCount }) {
  const stats = [
    { label: "Study time today", value: `${timer.totalStudyMinutesToday}m` },
    { label: "Tasks completed", value: completedTaskCount },
    { label: "Current streak", value: `${timer.streak} day${timer.streak === 1 ? "" : "s"}` },
    { label: "Weekly study hours", value: `${timer.weeklyStudyHours}h` },
    { label: "Pomodoros completed", value: timer.completedSessionsToday },
  ];

  return (
    <GlassCard className="p-5">
      <h2 className="text-sm font-medium text-slate-200">Study Statistics</h2>
      <dl className="mt-3 space-y-2.5">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center justify-between text-sm">
            <dt className="text-slate-400">{s.label}</dt>
            <dd className="font-semibold text-slate-100">{s.value}</dd>
          </div>
        ))}
      </dl>
    </GlassCard>
  );
}
