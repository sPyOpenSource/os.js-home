import { createFileRoute } from "@tanstack/react-router";

type Msg = { type: string; id?: string; payload?: unknown };

function handle(msg: Msg): Msg {
  switch (msg.type) {
    case "ping":
      return { type: "pong", id: msg.id, payload: { t: Date.now() } };
    case "time":
      return { type: "time", id: msg.id, payload: { iso: new Date().toISOString() } };
    case "echo":
      return { type: "echo", id: msg.id, payload: msg.payload };
    case "system":
      return {
        type: "system",
        id: msg.id,
        payload: {
          ua: "webOS Worker",
          uptime: Math.round(performance.now()),
          random: Math.random(),
        },
      };
    default:
      return { type: "error", id: msg.id, payload: { message: `unknown type: ${msg.type}` } };
  }
}

export const Route = createFileRoute("/api/ws")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (request.headers.get("Upgrade") !== "websocket") {
          return new Response("Expected WebSocket upgrade", { status: 426 });
        }

        // Cloudflare Workers WebSocketPair (available in workerd runtime).
        const WSPair = (globalThis as unknown as { WebSocketPair?: new () => Record<string, WebSocket> }).WebSocketPair;
        if (!WSPair) {
          return new Response("WebSockets not supported in this runtime", { status: 500 });
        }
        const pair = new WSPair();
        const client = pair[0];
        const server = pair[1] as WebSocket & { accept: () => void };

        server.accept();

        server.addEventListener("message", (event: MessageEvent) => {
          let msg: Msg;
          try {
            msg = typeof event.data === "string" ? JSON.parse(event.data) : { type: "error" };
          } catch {
            server.send(JSON.stringify({ type: "error", payload: { message: "invalid JSON" } }));
            return;
          }
          server.send(JSON.stringify(handle(msg)));
        });

        server.send(
          JSON.stringify({ type: "welcome", payload: { message: "Connected to webOS backend" } }),
        );

        // Heartbeat
        const interval = setInterval(() => {
          try {
            server.send(JSON.stringify({ type: "tick", payload: { t: Date.now() } }));
          } catch {
            clearInterval(interval);
          }
        }, 5000);

        server.addEventListener("close", () => clearInterval(interval));

        return new Response(null, { status: 101, webSocket: client } as ResponseInit & { webSocket: WebSocket });
      },
    },
  },
});
