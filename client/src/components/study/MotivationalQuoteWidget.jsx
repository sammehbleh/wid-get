import GlassCard from "../GlassCard";

export default function MotivationalQuoteWidget({ quote }) {
  return (
    <GlassCard className="p-5">
      <h2 className="text-xs font-medium uppercase tracking-wide text-slate-400">Motivation</h2>
      <p className="mt-2 text-sm italic text-slate-200">"{quote}"</p>
    </GlassCard>
  );
}
