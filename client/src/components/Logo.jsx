const SIZES = {
  md: { icon: "h-8 w-8", text: "text-lg", gap: "gap-2" },
  lg: { icon: "h-12 w-12", text: "text-3xl", gap: "gap-3" },
};

export default function Logo({ className = "", size = "md" }) {
  const s = SIZES[size] || SIZES.md;
  return (
    <span className={`flex items-center ${s.gap} ${className}`}>
      <svg viewBox="0 0 32 32" className={`${s.icon} shrink-0`} aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="url(#widget-gradient)" />
        <rect x="6" y="6" width="8.5" height="8.5" rx="2.5" fill="white" fillOpacity="0.95" />
        <rect x="17.5" y="6" width="8.5" height="8.5" rx="2.5" fill="white" fillOpacity="0.55" />
        <rect x="6" y="17.5" width="8.5" height="8.5" rx="2.5" fill="white" fillOpacity="0.55" />
        <rect x="17.5" y="17.5" width="8.5" height="8.5" rx="2.5" fill="white" fillOpacity="0.95" />
        <defs>
          <linearGradient id="widget-gradient" x1="0" y1="0" x2="32" y2="32">
            <stop offset="0" stopColor="#818cf8" />
            <stop offset="1" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
      </svg>
      <span className={`${s.text} font-bold tracking-tight text-white`}>
        Wid
        <span className="text-indigo-400">+</span>
        <span className="font-medium text-slate-300">get</span>
      </span>
    </span>
  );
}
