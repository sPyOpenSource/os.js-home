import { useEffect, useState } from "react";
import { useWebSocket } from "../useWebSocket";
import { Plug, PlugZap, Send, Trash2 } from "lucide-react";

export function Connection() {
  const { status, messages, connect, disconnect, send, clear } = useWebSocket();
  const [text, setText] = useState("hello backend");

  useEffect(() => {
    connect();
  }, [connect]);

  const statusColor =
    status === "open" ? "bg-green-500" : status === "connecting" ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="h-full flex flex-col bg-window text-sm">
      <div className="h-11 flex items-center gap-2 px-3 border-b bg-muted/40">
        <span className={`w-2.5 h-2.5 rounded-full ${statusColor}`} />
        <span className="font-medium capitalize">{status}</span>
        <span className="text-xs text-muted-foreground">/api/ws</span>
        <div className="ml-auto flex gap-1">
          {status === "open" ? (
            <button
              onClick={disconnect}
              className="px-2 py-1 rounded hover:bg-black/5 inline-flex items-center gap-1 text-xs"
            >
              <Plug className="w-3 h-3" /> Disconnect
            </button>
          ) : (
            <button
              onClick={connect}
              className="px-2 py-1 rounded hover:bg-black/5 inline-flex items-center gap-1 text-xs"
            >
              <PlugZap className="w-3 h-3" /> Connect
            </button>
          )}
          <button
            onClick={clear}
            className="px-2 py-1 rounded hover:bg-black/5 inline-flex items-center gap-1 text-xs"
          >
            <Trash2 className="w-3 h-3" /> Clear
          </button>
        </div>
      </div>

      <div className="px-3 py-2 border-b flex flex-wrap gap-1.5">
        {(["ping", "time", "system"] as const).map((t) => (
          <button
            key={t}
            disabled={status !== "open"}
            onClick={() => send({ type: t, id: crypto.randomUUID() })}
            className="px-2 py-1 text-xs rounded bg-primary/10 hover:bg-primary/20 disabled:opacity-40"
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-3 font-mono text-xs space-y-1 bg-black/[0.02]">
        {messages.length === 0 && (
          <div className="text-muted-foreground italic">No messages yet…</div>
        )}
        {messages.map((m, i) => {
          const incoming = !["ping", "time", "echo", "system"].includes(m.type) || m.type === "echo";
          return (
            <div key={i} className="flex gap-2">
              <span className={incoming ? "text-blue-600" : "text-emerald-700"}>
                {incoming ? "←" : "→"}
              </span>
              <span className="font-semibold">{m.type}</span>
              {m.payload != null && (
                <span className="text-muted-foreground truncate">
                  {JSON.stringify(m.payload)}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t p-2 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && status === "open") {
              send({ type: "echo", id: crypto.randomUUID(), payload: text });
            }
          }}
          className="flex-1 h-8 px-2 rounded border bg-white text-xs outline-none focus:ring-2 ring-primary/40"
          placeholder="Type a message to echo…"
        />
        <button
          disabled={status !== "open"}
          onClick={() => send({ type: "echo", id: crypto.randomUUID(), payload: text })}
          className="h-8 px-3 rounded bg-primary text-primary-foreground text-xs inline-flex items-center gap-1 disabled:opacity-40"
        >
          <Send className="w-3 h-3" /> Send
        </button>
      </div>
    </div>
  );
}
