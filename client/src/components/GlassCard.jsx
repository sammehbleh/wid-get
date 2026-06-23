export default function GlassCard({ children, className = "", as: Tag = "div", ...rest }) {
  return (
    <Tag
      className={`rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-md shadow-lg shadow-black/10 ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
