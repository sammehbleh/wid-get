import { providerMeta } from "../data/accounts";

export default function ProviderBadge({ type, provider, className = "" }) {
  const meta = providerMeta(type, provider);
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white ${className}`}
      style={{ backgroundColor: meta.color }}
      title={meta.label}
    >
      {meta.initials}
    </span>
  );
}
