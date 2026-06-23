export default function BackgroundLayer() {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-background-image bg-cover bg-center bg-fixed" />
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]" />
    </div>
  );
}
