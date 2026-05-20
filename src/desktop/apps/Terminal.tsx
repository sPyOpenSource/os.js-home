import { useState, useRef, useEffect } from "react";

const HELP = `Available commands:
  help        Show this message
  about       About this system
  echo TEXT   Print TEXT
  date        Current date
  whoami      Current user
  clear       Clear screen`;

export function Terminal() {
  const [lines, setLines] = useState<string[]>(["webOS Terminal v1.0", "Type 'help' to get started.", ""]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView(); }, [lines]);

  const run = (cmd: string) => {
    const [c, ...rest] = cmd.trim().split(/\s+/);
    const arg = rest.join(" ");
    const out: string[] = [`guest@webos ~ % ${cmd}`];
    switch (c) {
      case "": break;
      case "help": out.push(HELP); break;
      case "about": out.push("webOS — a macOS-style desktop built with React."); break;
      case "echo": out.push(arg); break;
      case "date": out.push(new Date().toString()); break;
      case "whoami": out.push("guest"); break;
      case "clear": setLines([]); return;
      default: out.push(`zsh: command not found: ${c}`);
    }
    setLines((l) => [...l, ...out, ""]);
  };

  return (
    <div className="h-full bg-black text-green-300 font-mono text-xs p-3 overflow-auto" onClick={(e) => (e.currentTarget.querySelector("input") as HTMLInputElement)?.focus()}>
      {lines.map((l, i) => <pre key={i} className="whitespace-pre-wrap leading-relaxed">{l}</pre>)}
      <div className="flex">
        <span className="text-green-400">guest@webos ~ %&nbsp;</span>
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { run(input); setInput(""); }
          }}
          className="flex-1 bg-transparent outline-none text-green-300"
        />
      </div>
      <div ref={endRef} />
    </div>
  );
}
