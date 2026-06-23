export default function Logo({ className = "" }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden="true">
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
      <span className="text-lg font-bold tracking-tight text-white">
        Wid
        <span className="text-indigo-400">+</span>
        <span className="font-medium text-slate-300">get</span>
      </span>
    </span>
  );
}
