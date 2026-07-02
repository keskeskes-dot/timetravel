export default function Loading() {
  return (
    <section className="container-tt flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <div className="flex items-center gap-1.5">
        <span className="h-3 w-3 animate-bounce rounded-full bg-chrono-teal [animation-delay:-0.3s]" />
        <span className="h-3 w-3 animate-bounce rounded-full bg-chrono-teal [animation-delay:-0.15s]" />
        <span className="h-3 w-3 animate-bounce rounded-full bg-chrono-teal" />
      </div>
      <p className="mt-6 text-sm text-slate-400">Synchronisation temporelle…</p>
    </section>
  );
}
