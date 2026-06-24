import { createContext, useContext, useEffect, useRef, useState } from "react";
import { ambientEngine, SOUND_CATEGORIES } from "../utils/ambientAudio";

const AudioPlayerContext = createContext(null);
const STORAGE_KEY = "wid-get-audio-player";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { categoryId: "lofi", volume: 0.5, shuffle: false, repeat: true };
    return { categoryId: "lofi", volume: 0.5, shuffle: false, repeat: true, ...JSON.parse(raw) };
  } catch {
    return { categoryId: "lofi", volume: 0.5, shuffle: false, repeat: true };
  }
}

export function AudioPlayerProvider({ children }) {
  const initial = useRef(loadState());
  const [categoryId, setCategoryId] = useState(initial.current.categoryId);
  const [volume, setVolume] = useState(initial.current.volume);
  const [shuffle, setShuffle] = useState(initial.current.shuffle);
  const [repeat, setRepeat] = useState(initial.current.repeat);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ categoryId, volume, shuffle, repeat }));
  }, [categoryId, volume, shuffle, repeat]);

  useEffect(() => {
    if (playing) ambientEngine.setVolume(volume);
  }, [volume, playing]);

  function play(id = categoryId) {
    setCategoryId(id);
    ambientEngine.play(id);
    ambientEngine.setVolume(volume);
    setPlaying(true);
  }

  function pause() {
    ambientEngine.stop();
    setPlaying(false);
  }

  function toggle() {
    if (playing) pause();
    else play();
  }

  function skip(direction = 1) {
    const ids = SOUND_CATEGORIES.map((c) => c.id);
    const currentIndex = ids.indexOf(categoryId);
    let nextIndex;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * ids.length);
    } else {
      nextIndex = (currentIndex + direction + ids.length) % ids.length;
    }
    const nextId = ids[nextIndex];
    setCategoryId(nextId);
    if (playing) {
      ambientEngine.play(nextId);
      ambientEngine.setVolume(volume);
    }
  }

  return (
    <AudioPlayerContext.Provider
      value={{
        categoryId,
        volume,
        setVolume,
        shuffle,
        setShuffle,
        repeat,
        setRepeat,
        playing,
        play,
        pause,
        toggle,
        skip,
        getAnalyser: () => ambientEngine.getAnalyser(),
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  return ctx;
}
