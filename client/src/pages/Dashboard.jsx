import { useMemo, useState } from "react";
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter } from "@dnd-kit/core";
import Navbar from "../components/Navbar";
import BackgroundLayer from "../components/BackgroundLayer";
import Notepad from "../components/Notepad";
import MusicRecommendation from "../components/MusicRecommendation";
import DashboardColumn from "../components/DashboardColumn";
import { randomQuote } from "../data/quotes";
import { useAuth } from "../context/AuthContext";
import { useDashboardLayout } from "../hooks/useDashboardLayout";
import { WIDGETS } from "../data/widgets";

const NOTE_SIZES = ["compact", "normal", "large"];

export default function Dashboard() {
  const { user } = useAuth();
  const quote = useMemo(randomQuote, []);
  const firstName = user?.name?.split(" ")[0] || "there";
  const [editMode, setEditMode] = useState(false);

  const { layout, moveWidget, hideWidget, showWidget, setNotepadSize, reset } =
    useDashboardLayout(user?.id);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    moveWidget(active.id, over.id);
  }

  function cycleNotepadSize() {
    const i = NOTE_SIZES.indexOf(layout.notepadSize);
    setNotepadSize(NOTE_SIZES[(i + 1) % NOTE_SIZES.length]);
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <BackgroundLayer />
      <Navbar />

      <main className="flex w-full flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-8 grid grid-cols-1 gap-4 sm:mb-10 sm:grid-cols-3 sm:items-center sm:gap-6">
          <div className="sm:col-span-2">
            <h1 className="font-greeting text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Welcome back, {firstName}!
            </h1>
            <p className="mt-3 max-w-2xl text-base italic text-slate-300 sm:mt-4 sm:text-lg lg:text-xl">
              "{quote}"
            </p>
          </div>
          <MusicRecommendation className="w-full" />
        </header>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setEditMode((v) => !v)}
            className={`rounded-lg border px-3 py-1.5 text-sm transition ${
              editMode
                ? "border-indigo-400 bg-indigo-500 text-white"
                : "border-white/15 bg-white/5 text-slate-200 hover:bg-white/10"
            }`}
          >
            {editMode ? "Done Customizing" : "Customize Layout"}
          </button>

          {editMode && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={cycleNotepadSize}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10"
              >
                Notes size: {layout.notepadSize}
              </button>
              <button
                onClick={reset}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10"
              >
                Reset Layout
              </button>
            </div>
          )}
        </div>

        {editMode && layout.hidden.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-white/20 p-3">
            <span className="text-xs text-slate-400">Hidden:</span>
            {layout.hidden.map((id) => (
              <button
                key={id}
                onClick={() => showWidget(id)}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-200 hover:bg-white/10"
              >
                + {WIDGETS[id].title}
              </button>
            ))}
          </div>
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[320px_1fr_320px]">
            <DashboardColumn id="left" items={layout.left} editMode={editMode} onHide={hideWidget} />

            <Notepad size={layout.notepadSize} className="h-full" />

            <DashboardColumn id="right" items={layout.right} editMode={editMode} onHide={hideWidget} />
          </div>
        </DndContext>
      </main>
    </div>
  );
}
