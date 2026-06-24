import { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import BackgroundLayer from "../components/BackgroundLayer";
import StudyTaskList from "../components/study/StudyTaskList";
import StudyReminders from "../components/study/StudyReminders";
import PomodoroTimer from "../components/study/PomodoroTimer";
import FlipClock from "../components/study/FlipClock";
import AudioPlayerCard from "../components/study/AudioPlayerCard";
import StudyStats from "../components/study/StudyStats";
import MotivationalQuoteWidget from "../components/study/MotivationalQuoteWidget";
import CurrentFocusWidget from "../components/study/CurrentFocusWidget";
import { usePomodoroTimer } from "../hooks/usePomodoroTimer";
import { isStudyCategory } from "../data/taskCategories";
import { randomStudyQuote } from "../data/studyQuotes";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const CURRENT_TASK_KEY = "wid-get-study-current-task";

export default function StudySession() {
  const { token } = useAuth();
  const [todos, setTodos] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(() => localStorage.getItem(CURRENT_TASK_KEY) || null);
  const [quote, setQuote] = useState(() => randomStudyQuote());

  const timer = usePomodoroTimer();

  const refresh = useCallback(async () => {
    const [todosData, remindersData] = await Promise.all([api.listTodos(token), api.listReminders(token)]);
    setTodos(todosData);
    setReminders(remindersData);
    setLoaded(true);
  }, [token]);

  useEffect(() => {
    refresh().catch(() => setLoaded(true));
  }, [refresh]);

  useEffect(() => {
    const id = setInterval(() => setQuote((prev) => randomStudyQuote(prev)), 20000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (currentTaskId) localStorage.setItem(CURRENT_TASK_KEY, currentTaskId);
    else localStorage.removeItem(CURRENT_TASK_KEY);
  }, [currentTaskId]);

  const studyTasks = useMemo(() => todos.filter((t) => isStudyCategory(t.category)), [todos]);
  const studyReminders = useMemo(() => reminders.filter((r) => isStudyCategory(r.category)), [reminders]);
  const currentTask = studyTasks.find((t) => t._id === currentTaskId);
  const completedTaskCount = studyTasks.filter((t) => t.done).length;

  function selectCurrent(task) {
    setCurrentTaskId(task._id);
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <BackgroundLayer />
      <Navbar />

      <main className="flex w-full flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-greeting text-3xl font-bold tracking-tight sm:text-4xl">Study Session</h1>
          <button
            onClick={() => setFocusMode((v) => !v)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
              focusMode
                ? "border-indigo-400 bg-indigo-500 text-white"
                : "border-white/15 bg-white/5 text-slate-200 hover:bg-white/10"
            }`}
          >
            {focusMode ? "Exit Focus Mode" : "Focus Mode"}
          </button>
        </header>

        {loaded && (
          <div className="flex flex-col gap-6">
            {/* Top: the two dominant components */}
            <div className={`grid grid-cols-1 gap-6 lg:grid-cols-2 ${focusMode ? "mx-auto w-full max-w-4xl" : ""}`}>
              <FlipClock
                large
                fullscreenContent={<PomodoroTimer timer={timer} currentTaskText={currentTask?.text} />}
              />
              <PomodoroTimer large timer={timer} currentTaskText={currentTask?.text} />
            </div>

            {!focusMode && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="flex flex-col gap-6">
                  <StudyTaskList
                    tasks={studyTasks}
                    onChange={refresh}
                    onSelectCurrent={selectCurrent}
                    currentTaskId={currentTaskId}
                  />
                  <StudyReminders reminders={studyReminders} onChange={refresh} />
                  <StudyStats timer={timer} completedTaskCount={completedTaskCount} />
                </div>

                <div className="flex flex-col gap-6">
                  <AudioPlayerCard />
                  <MotivationalQuoteWidget quote={quote} />
                  <CurrentFocusWidget task={currentTask} timer={timer} />
                </div>
              </div>
            )}

            {focusMode && (
              <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
                <CurrentFocusWidget task={currentTask} timer={timer} />
                <AudioPlayerCard />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
