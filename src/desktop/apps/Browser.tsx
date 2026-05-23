import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Share, Plus } from "lucide-react";

export function Browser() {
  const [url, setUrl] = useState("https://lovable.dev");
  return (
    <div className="h-full flex flex-col bg-window">
      <div className="h-11 flex items-center gap-2 px-3 border-b bg-muted/40">
        <button className="p-1 rounded hover:bg-black/5"><ArrowLeft className="w-4 h-4" /></button>
        <button className="p-1 rounded hover:bg-black/5"><ArrowRight className="w-4 h-4" /></button>
        <button className="p-1 rounded hover:bg-black/5"><RotateCw className="w-4 h-4" /></button>
        <div className="flex-1 mx-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full h-7 px-3 rounded-md bg-white border text-xs text-center outline-none focus:ring-2 ring-primary/40"
          />
        </div>
        <button className="p-1 rounded hover:bg-black/5"><Share className="w-4 h-4" /></button>
        <button className="p-1 rounded hover:bg-black/5"><Plus className="w-4 h-4" /></button>
      </div>
      <iframe src={url} className="flex-1 flex flex-col items-center justify-center text-center gap-3 bg-gradient-to-b from-sky-50 to-white">
      </iframe>
    </div>
  );
}
