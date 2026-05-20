import { useState } from "react";

export function TextEdit() {
  const [text, setText] = useState(
    "Welcome to TextEdit.\n\nStart typing to draft your note. Your text stays in this window for the session."
  );
  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-1.5 border-b text-xs text-muted-foreground flex gap-3">
        <span className="font-semibold">Helvetica</span>
        <span>12 pt</span>
        <span>Regular</span>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 w-full p-6 text-[14px] leading-relaxed bg-window resize-none outline-none font-mono"
      />
    </div>
  );
}
