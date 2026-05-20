import { useEffect, useState } from "react";
import { Apple, Wifi, Search, BatteryFull } from "lucide-react";
import { useDesktop, APP_TITLES } from "./store";

export function MenuBar() {
  const { focusedId, windows, open } = useDesktop();
  const focused = windows.find((w) => w.id === focusedId);
  const activeTitle = focused ? APP_TITLES[focused.appId].title : "Finder";
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const date = now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  return (
    <div
      className="fixed top-0 left-0 right-0 h-7 z-[9999] flex items-center px-3 text-[13px] glass bg-menubar text-menubar-foreground"
      style={{ boxShadow: "var(--shadow-menubar)" }}
    >
      <button
        className="px-2 h-full flex items-center hover:bg-black/10 rounded"
        onClick={() => open("about")}
      >
        <Apple className="w-4 h-4" />
      </button>
      <span className="px-2 font-semibold">{activeTitle}</span>
      <span className="px-2 text-foreground/80 hover:bg-black/10 rounded h-full inline-flex items-center cursor-default">File</span>
      <span className="px-2 text-foreground/80 hover:bg-black/10 rounded h-full inline-flex items-center cursor-default">Edit</span>
      <span className="px-2 text-foreground/80 hover:bg-black/10 rounded h-full inline-flex items-center cursor-default">View</span>
      <span className="px-2 text-foreground/80 hover:bg-black/10 rounded h-full inline-flex items-center cursor-default">Window</span>
      <span className="px-2 text-foreground/80 hover:bg-black/10 rounded h-full inline-flex items-center cursor-default">Help</span>

      <div className="ml-auto flex items-center gap-3 text-foreground/80">
        <BatteryFull className="w-4 h-4" />
        <Wifi className="w-4 h-4" />
        <Search className="w-4 h-4" />
        <span className="tabular-nums">{date}  {time}</span>
      </div>
    </div>
  );
}
