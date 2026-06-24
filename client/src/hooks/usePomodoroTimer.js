import { useCallback, useEffect, useRef, useState } from "react";
import { toLocalDateString } from "../utils/date";

const STORAGE_KEY = "wid-get-pomodoro";

const DEFAULT_SETTINGS = { focus: 25, shortBreak: 5, longBreak: 15, sessionsBeforeLong: 4 };

function defaultState() {
  return {
    settings: DEFAULT_SETTINGS,
    phase: "focus",
    sessionNumber: 1,
    running: false,
    phaseEndsAt: null,
    pausedRemainingMs: DEFAULT_SETTINGS.focus * 60 * 1000,
    statsDate: toLocalDateString(),
    completedSessionsToday: 0,
    totalStudySecondsToday: 0,
    history: {}, // { "YYYY-MM-DD": totalStudySeconds }
  };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const merged = { ...defaultState(), ...parsed, settings: { ...DEFAULT_SETTINGS, ...parsed.settings } };

    // Roll over daily counters if the persisted state is from a previous day.
    const today = toLocalDateString();
    if (merged.statsDate !== today) {
      if (merged.totalStudySecondsToday > 0) {
        merged.history[merged.statsDate] = merged.totalStudySecondsToday;
      }
      merged.statsDate = today;
      merged.completedSessionsToday = 0;
      merged.totalStudySecondsToday = 0;
    }

    // If a phase was running and already elapsed while away, settle it once
    // and pause rather than silently fast-forwarding through several cycles.
    if (merged.running && merged.phaseEndsAt && merged.phaseEndsAt <= Date.now()) {
      return settlePhase(merged, false);
    }
    return merged;
  } catch {
    return defaultState();
  }
}

function phaseDurationMs(state, phase) {
  const minutes =
    phase === "focus" ? state.settings.focus : phase === "short" ? state.settings.shortBreak : state.settings.longBreak;
  return minutes * 60 * 1000;
}

function settlePhase(state, keepRunning) {
  const next = { ...state };
  if (next.phase === "focus") {
    next.completedSessionsToday += 1;
    next.totalStudySecondsToday += state.settings.focus * 60;
    next.phase = next.sessionNumber % state.settings.sessionsBeforeLong === 0 ? "long" : "short";
  } else {
    next.phase = "focus";
    next.sessionNumber = state.phase === "long" ? 1 : next.sessionNumber + 1;
  }
  next.pausedRemainingMs = phaseDurationMs(next, next.phase);
  next.running = keepRunning;
  next.phaseEndsAt = keepRunning ? Date.now() + next.pausedRemainingMs : null;
  return next;
}

export function usePomodoroTimer() {
  const [state, setState] = useState(load);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (!state.running) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [state.running]);

  // Drive phase transitions off the ticking clock rather than the timer ref.
  useEffect(() => {
    if (state.running && state.phaseEndsAt && state.phaseEndsAt <= now) {
      setState((prev) => settlePhase(prev, true));
    }
  }, [now, state.running, state.phaseEndsAt]);

  const remainingMs = state.running && state.phaseEndsAt ? Math.max(0, state.phaseEndsAt - now) : state.pausedRemainingMs;

  const start = useCallback(() => {
    setState((prev) => ({
      ...prev,
      running: true,
      phaseEndsAt: Date.now() + (prev.pausedRemainingMs || phaseDurationMs(prev, prev.phase)),
    }));
  }, []);

  const pause = useCallback(() => {
    setState((prev) => {
      if (!prev.running || !prev.phaseEndsAt) return { ...prev, running: false };
      return { ...prev, running: false, pausedRemainingMs: Math.max(0, prev.phaseEndsAt - Date.now()), phaseEndsAt: null };
    });
  }, []);

  const reset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      running: false,
      phaseEndsAt: null,
      pausedRemainingMs: phaseDurationMs(prev, prev.phase),
    }));
  }, []);

  const skip = useCallback(() => {
    setState((prev) => settlePhase(prev, false));
  }, []);

  const updateSettings = useCallback((partial) => {
    setState((prev) => {
      const settings = { ...prev.settings, ...partial };
      const next = { ...prev, settings };
      if (!prev.running) next.pausedRemainingMs = phaseDurationMs(next, next.phase);
      return next;
    });
  }, []);

  const weeklyMinutes = Object.entries(state.history)
    .filter(([date]) => {
      const d = new Date(date + "T00:00:00");
      return (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24) <= 7;
    })
    .reduce((sum, [, seconds]) => sum + seconds, state.totalStudySecondsToday) / 60;

  const streak = (() => {
    let count = 0;
    let cursor = new Date();
    // Today counts if there's already study time logged today.
    if (state.totalStudySecondsToday > 0) count++;
    cursor.setDate(cursor.getDate() - 1);
    while (true) {
      const key = toLocalDateString(cursor);
      if (state.history[key] > 0) {
        count++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
    return count;
  })();

  return {
    settings: state.settings,
    updateSettings,
    phase: state.phase,
    sessionNumber: state.sessionNumber,
    running: state.running,
    remainingMs,
    start,
    pause,
    reset,
    skip,
    completedSessionsToday: state.completedSessionsToday,
    totalStudyMinutesToday: Math.round(state.totalStudySecondsToday / 60),
    weeklyStudyHours: Math.round((weeklyMinutes / 60) * 10) / 10,
    streak,
  };
}
