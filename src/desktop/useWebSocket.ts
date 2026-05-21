import { useEffect, useRef, useState, useCallback } from "react";

export type WSMessage = { type: string; id?: string; payload?: unknown };
export type WSStatus = "idle" | "connecting" | "open" | "closed" | "error";

export function useWebSocket() {
  const [status, setStatus] = useState<WSStatus>("idle");
  const [messages, setMessages] = useState<WSMessage[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState <= 1) return;
    setStatus("connecting");
    const proto = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${proto}://${window.location.host}/api/ws`);
    wsRef.current = ws;
    ws.onopen = () => setStatus("open");
    ws.onclose = () => setStatus("closed");
    ws.onerror = () => setStatus("error");
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data) as WSMessage;
        setMessages((m) => [...m.slice(-99), msg]);
      } catch {
        /* ignore */
      }
    };
  }, []);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
  }, []);

  const send = useCallback((msg: WSMessage) => {
    if (wsRef.current?.readyState === 1) {
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  useEffect(() => () => wsRef.current?.close(), []);

  return { status, messages, connect, disconnect, send, clear: () => setMessages([]) };
}
