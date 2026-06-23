export default function LandingBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="bg-landing-base absolute inset-0 bg-slate-950" />
      <div className="animate-drift-a absolute -left-32 -top-32 h-[32rem] w-[32rem] rounded-full bg-indigo-500/40 blur-3xl" />
      <div className="animate-drift-b absolute -right-24 top-1/4 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/30 blur-3xl" />
      <div className="animate-drift-c absolute bottom-[-10rem] left-1/3 h-[34rem] w-[34rem] rounded-full bg-sky-500/25 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_60%)]" />
    </div>
  );
}
