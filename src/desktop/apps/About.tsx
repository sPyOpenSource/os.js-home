export function About() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center gap-3">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-400 flex items-center justify-center text-4xl shadow-inner">
        
      </div>
      <h2 className="text-2xl font-semibold">webOS</h2>
      <p className="text-sm text-muted-foreground">Version 1.0 (Lovable Build)</p>
      <div className="mt-4 text-xs text-muted-foreground space-y-1">
        <div><span className="font-semibold text-foreground">Chip:</span> React 19 + TanStack Start</div>
        <div><span className="font-semibold text-foreground">Memory:</span> Browser-bound</div>
        <div><span className="font-semibold text-foreground">Display:</span> Retina (CSS)</div>
      </div>
      <button className="mt-4 px-4 py-1.5 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90">
        More Info…
      </button>
    </div>
  );
}
