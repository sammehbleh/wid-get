import GlassCard from "../GlassCard";
import AudioVisualizer from "./AudioVisualizer";
import { useAudioPlayer } from "../../context/AudioPlayerContext";
import { SOUND_CATEGORIES } from "../../utils/ambientAudio";

export default function AudioPlayerCard() {
  const player = useAudioPlayer();
  const current = SOUND_CATEGORIES.find((c) => c.id === player.categoryId) || SOUND_CATEGORIES[0];

  return (
    <GlassCard className="flex flex-col p-5">
      <h2 className="text-sm font-medium text-slate-200">Focus Sounds</h2>
      <p className="mt-1 text-xs text-slate-400">
        Generated ambient soundscapes — no external tracks, just a calm backdrop.
      </p>

      <AudioVisualizer className="mt-3 h-16 w-full rounded-lg bg-white/[0.03]" />

      <p className="mt-3 text-center text-sm font-medium text-slate-100">{current.label}</p>

      <div className="mt-3 flex items-center justify-center gap-3">
        <button
          onClick={() => player.skip(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-slate-200 hover:bg-white/10"
          aria-label="Previous"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M6 6h2v12H6zM20 6L9 12l11 6z" /></svg>
        </button>
        <button
          onClick={player.toggle}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500 text-white hover:bg-indigo-400"
          aria-label={player.playing ? "Pause" : "Play"}
        >
          {player.playing ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>
        <button
          onClick={() => player.skip(1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-slate-200 hover:bg-white/10"
          aria-label="Next"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M16 6h2v12h-2zM4 6l11 6-11 6z" /></svg>
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2">
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

      <div className="mt-4 grid grid-cols-2 gap-1.5">
        {SOUND_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => player.play(c.id)}
            className={`rounded-lg border px-2 py-1.5 text-left text-xs transition ${
              c.id === player.categoryId
                ? "border-indigo-400 bg-indigo-500/20 text-indigo-200"
                : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/10"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
    </GlassCard>
  );
}
