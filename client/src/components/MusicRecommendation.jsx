import { useState } from "react";
import GlassCard from "./GlassCard";
import { fetchRandomTrack } from "../data/music";

export default function MusicRecommendation({ className = "" }) {
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(false);

  async function recommend() {
    setLoading(true);
    try {
      const next = await fetchRandomTrack(track);
      setTrack(next);
    } finally {
      setLoading(false);
    }
  }

  return (
    <GlassCard className={`p-4 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {track?.artwork && (
            <img
              src={track.artwork}
              alt=""
              className="h-10 w-10 shrink-0 rounded-lg object-cover"
            />
          )}
          <div className="min-w-0">
            <h2 className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Music Pick
            </h2>
            {track ? (
              <div className="mt-1">
                <p className="truncate text-sm font-medium text-slate-100">{track.title}</p>
                <p className="truncate text-xs text-slate-400">
                  {track.artist} · {track.genre}
                </p>
              </div>
            ) : (
              <p className="mt-1 text-sm text-slate-400">Need something to listen to?</p>
            )}
          </div>
        </div>
        <button
          onClick={recommend}
          disabled={loading}
          className="shrink-0 rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-medium hover:bg-indigo-400 disabled:opacity-50"
        >
          {loading ? "..." : track ? "Another" : "Recommend"}
        </button>
      </div>
    </GlassCard>
  );
}
