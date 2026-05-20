import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type AppId = "finder" | "textedit" | "calculator" | "browser" | "about" | "terminal";

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  prev?: { x: number; y: number; w: number; h: number };
}

interface Ctx {
  windows: WindowState[];
  focusedId: string | null;
  open: (appId: AppId) => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  update: (id: string, patch: Partial<WindowState>) => void;
  minimize: (id: string) => void;
  toggleMax: (id: string) => void;
}

const DesktopCtx = createContext<Ctx | null>(null);

const APP_META: Record<AppId, { title: string; w: number; h: number }> = {
  finder: { title: "Finder", w: 720, h: 460 },
  textedit: { title: "TextEdit", w: 560, h: 420 },
  calculator: { title: "Calculator", w: 280, h: 380 },
  browser: { title: "Safari", w: 820, h: 540 },
  about: { title: "About This Mac", w: 460, h: 360 },
  terminal: { title: "Terminal", w: 600, h: 380 },
};

let zCounter = 10;
let idCounter = 0;

export function DesktopProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const focus = useCallback((id: string) => {
    zCounter += 1;
    setFocusedId(id);
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, z: zCounter, minimized: false } : w)));
  }, []);

  const open = useCallback((appId: AppId) => {
    setWindows((ws) => {
      const existing = ws.find((w) => w.appId === appId);
      if (existing) {
        zCounter += 1;
        setFocusedId(existing.id);
        return ws.map((w) => (w.id === existing.id ? { ...w, z: zCounter, minimized: false } : w));
      }
      const meta = APP_META[appId];
      idCounter += 1;
      zCounter += 1;
      const id = `${appId}-${idCounter}`;
      const offset = (idCounter % 6) * 24;
      const newWin: WindowState = {
        id,
        appId,
        title: meta.title,
        w: meta.w,
        h: meta.h,
        x: 120 + offset,
        y: 80 + offset,
        z: zCounter,
        minimized: false,
        maximized: false,
      };
      setFocusedId(id);
      return [...ws, newWin];
    });
  }, []);

  const close = useCallback((id: string) => {
    setWindows((ws) => ws.filter((w) => w.id !== id));
    setFocusedId((f) => (f === id ? null : f));
  }, []);

  const update = useCallback((id: string, patch: Partial<WindowState>) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, ...patch } : w)));
  }, []);

  const minimize = useCallback((id: string) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
  }, []);

  const toggleMax = useCallback((id: string) => {
    setWindows((ws) =>
      ws.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized && w.prev) {
          return { ...w, ...w.prev, maximized: false, prev: undefined };
        }
        return {
          ...w,
          prev: { x: w.x, y: w.y, w: w.w, h: w.h },
          x: 0,
          y: 28,
          w: window.innerWidth,
          h: window.innerHeight - 28 - 90,
          maximized: true,
        };
      })
    );
  }, []);

  return (
    <DesktopCtx.Provider value={{ windows, focusedId, open, close, focus, update, minimize, toggleMax }}>
      {children}
    </DesktopCtx.Provider>
  );
}

export function useDesktop() {
  const ctx = useContext(DesktopCtx);
  if (!ctx) throw new Error("useDesktop must be used inside DesktopProvider");
  return ctx;
}

export const APP_TITLES = APP_META;
