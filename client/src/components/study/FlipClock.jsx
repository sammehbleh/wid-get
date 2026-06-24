import { useEffect, useState } from "react";
import GlassCard from "../GlassCard";
import BackgroundLayer from "../BackgroundLayer";
import FlipDigit from "./FlipDigit";

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function ClockFace({ now, size = "text-5xl" }) {
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  const dateStr = now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="flex flex-col items-center">
      <div className={`font-greeting flex gap-1 ${size} font-bold tabular-nums text-white [perspective:400px]`}>
        {[...h].map((d, i) => (
          <FlipDigit key={`h${i}`} value={d} />
        ))}
        <span className="opacity-50">:</span>
        {[...m].map((d, i) => (
          <FlipDigit key={`m${i}`} value={d} />
        ))}
        <span className="opacity-50">:</span>
        {[...s].map((d, i) => (
          <FlipDigit key={`s${i}`} value={d} />
        ))}
      </div>
      <p className="mt-3 text-sm text-slate-300">{dateStr}</p>
    </div>
  );
}

export default function FlipClock({ fullscreenContent }) {
  const now = useClock();
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!fullscreen) return;
    function onKey(e) {
      if (e.key === "Escape") setFullscreen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen]);

  return (
    <>
      <GlassCard className="flex flex-col items-center p-6">
        <ClockFace now={now} />
        <button
          onClick={() => setFullscreen(true)}
          className="mt-4 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10"
        >
          Fullscreen
        </button>
      </GlassCard>

      {fullscreen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 p-6">
          <BackgroundLayer />
          <button
            onClick={() => setFullscreen(false)}
            className="absolute right-6 top-6 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-slate-100 hover:bg-white/20"
          >
            Exit Fullscreen
          </button>
          <ClockFace now={now} size="text-6xl sm:text-7xl" />
          <div className="w-full max-w-sm">{fullscreenContent}</div>
        </div>
      )}
    </>
  );
}
