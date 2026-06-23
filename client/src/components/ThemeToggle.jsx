import { useTheme } from "../context/ThemeContext";

const ORDER = ["dark", "light", "system"];
const LABELS = { dark: "Dark mode", light: "Light mode", system: "Auto (system) theme" };

function Icon({ theme }) {
  if (theme === "light") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="4" />
        <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    );
  }
  if (theme === "system") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="13" rx="1.5" />
        <path strokeLinecap="round" d="M8 21h8M12 17v4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" stroke="none">
      <path d="M20.742 13.045a8.088 8.088 0 0 1-2.077.273c-4.495 0-8.137-3.642-8.137-8.137 0-1.555.437-3.007 1.197-4.245A10.205 10.205 0 0 0 12 1c-5.799 0-10.5 4.701-10.5 10.5S6.201 22 12 22c4.097 0 7.65-2.34 9.31-5.752a8.135 8.135 0 0 1-.568-3.203z" />
    </svg>
  );
}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  function cycle() {
    const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
    setTheme(next);
  }

  return (
    <button
      onClick={cycle}
      title={LABELS[theme]}
      aria-label={LABELS[theme]}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-slate-100 hover:bg-white/10"
    >
      <Icon theme={theme} />
    </button>
  );
}
