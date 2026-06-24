import GlassCard from "../GlassCard";
import AudioVisualizer from "./AudioVisualizer";
import { useAudioPlayer } from "../../context/AudioPlayerContext";
import { SOUND_CATEGORIES } from "../../utils/ambientAudio";

export default function AudioPlayerCard() {
  const player = useAudioPlayer();

  return (
    <GlassCard className="flex flex-col p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-200">Focus Sounds</h2>
        <select
          value={player.categoryId}
          onChange={(e) => player.play(e.target.value)}
          className="min-w-0 rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-xs text-slate-200 outline-none focus:border-indigo-400"
        >
          {SOUND_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id} className="bg-slate-800">
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <AudioVisualizer className="mt-3 h-10 w-full rounded-lg bg-white/[0.03]" />

      <div className="mt-3 flex items-center justify-center gap-3">
        <button
          onClick={() => player.skip(-1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-slate-200 hover:bg-white/10"
          aria-label="Previous"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M6 6h2v12H6zM20 6L9 12l11 6z" /></svg>
        </button>
        <button
          onClick={player.toggle}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-white hover:bg-indigo-400"
          aria-label={player.playing ? "Pause" : "Play"}
        >
          {player.playing ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>
        <button
          onClick={() => player.skip(1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-slate-200 hover:bg-white/10"
          aria-label="Next"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M16 6h2v12h-2zM4 6l11 6-11 6z" /></svg>
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => player.setShuffle(!player.shuffle)}
          className={`rounded-lg border px-2 py-1 text-xs ${
            player.shuffle ? "border-indigo-400 bg-indigo-500/20 text-indigo-200" : "border-white/15 bg-white/5 text-slate-300"
          }`}
        >
          Shuffle
        </button>
        <button
          onClick={() => player.setRepeat(!player.repeat)}
          className={`rounded-lg border px-2 py-1 text-xs ${
            player.repeat ? "border-indigo-400 bg-indigo-500/20 text-indigo-200" : "border-white/15 bg-white/5 text-slate-300"
          }`}
        >
          Repeat
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={player.volume}
          onChange={(e) => player.setVolume(Number(e.target.value))}
          className="ml-auto h-1.5 flex-1 accent-indigo-400"
        />
      </div>
    </GlassCard>
  );
}
