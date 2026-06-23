import { useEffect, useState } from "react";
import GlassCard from "./GlassCard";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function toKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function MiniCalendar() {
  const { token } = useAuth();
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(toKey(today.getFullYear(), today.getMonth(), today.getDate()));
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");

  useEffect(() => {
    api.listEvents(token).then(setEvents).catch(() => setEvents([]));
  }, [token]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const eventsByDate = events.reduce((acc, e) => {
    (acc[e.date] ||= []).push(e);
    return acc;
  }, {});

  function changeMonth(delta) {
    setCursor(new Date(year, month + delta, 1));
  }

  const isToday = (day) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const selectedEvents = eventsByDate[selected] || [];

  async function addEvent(e) {
    e.preventDefault();
    if (!title.trim()) return;
    const created = await api.createEvent(token, {
      date: selected,
      title: title.trim(),
      time: time.trim(),
      place: place.trim(),
    });
    setEvents((prev) => [created, ...prev]);
    setTitle("");
    setTime("");
    setPlace("");
  }

  async function removeEvent(id) {
    await api.deleteEvent(token, id);
    setEvents((prev) => prev.filter((e) => e._id !== id));
  }

  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between">
        <button onClick={() => changeMonth(-1)} className="px-1 text-slate-300 hover:text-white">
          ‹
        </button>
        <h2 className="text-sm font-medium text-slate-200">
          {cursor.toLocaleString(undefined, { month: "long", year: "numeric" })}
        </h2>
        <button onClick={() => changeMonth(1)} className="px-1 text-slate-300 hover:text-white">
          ›
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-y-1 text-center text-xs text-slate-400">
        {WEEKDAYS.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <span key={i} />;
          const key = toKey(year, month, day);
          const hasEvents = !!eventsByDate[key]?.length;
          const isSelected = key === selected;
          return (
            <button
              key={i}
              onClick={() => setSelected(key)}
              className={`relative flex h-6 items-center justify-center rounded-full text-xs transition ${
                isSelected
                  ? "bg-indigo-500 text-white"
                  : isToday(day)
                  ? "bg-white/15 text-white"
                  : "text-slate-200 hover:bg-white/10"
              }`}
            >
              {day}
              {hasEvents && !isSelected && (
                <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-indigo-400" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 border-t border-white/10 pt-3">
        <p className="text-xs font-medium text-slate-300">
          {new Date(selected).toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </p>

        <ul className="mt-2 max-h-28 space-y-1.5 overflow-y-auto">
          {selectedEvents.length === 0 && (
            <li className="text-xs text-slate-400">No events</li>
          )}
          {selectedEvents.map((ev) => (
            <li key={ev._id} className="flex items-start justify-between gap-2 text-xs text-slate-200">
              <div>
                <p>{ev.title}</p>
                {(ev.time || ev.place) && (
                  <p className="text-[11px] text-slate-400">
                    {[ev.time, ev.place].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
              <button onClick={() => removeEvent(ev._id)} className="shrink-0 text-slate-500 hover:text-rose-400">
                ✕
              </button>
            </li>
          ))}
        </ul>

        <form onSubmit={addEvent} className="mt-2 space-y-1.5">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event name..."
            className="w-full min-w-0 rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-xs outline-none focus:border-indigo-400"
          />
          <div className="flex gap-1.5">
            <input
              value={time}
              onChange={(e) => setTime(e.target.value)}
              type="time"
              className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-xs text-slate-200 outline-none focus:border-indigo-400"
            />
            <input
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="Place"
              className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-xs outline-none focus:border-indigo-400"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-indigo-500 px-2.5 py-1 text-xs hover:bg-indigo-400"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </GlassCard>
  );
}
