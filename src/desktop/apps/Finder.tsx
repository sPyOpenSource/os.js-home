import { useState } from "react";
import { Folder, FileText, Image as ImageIcon, Music, Star, HardDrive, Home, Download } from "lucide-react";

const SIDEBAR = [
  { label: "Favorites", items: [
    { icon: Star, label: "AirDrop" },
    { icon: Home, label: "Recents" },
    { icon: Download, label: "Downloads" },
    { icon: Folder, label: "Documents" },
  ]},
  { label: "Locations", items: [
    { icon: HardDrive, label: "Macintosh HD" },
  ]},
];

const FILES = [
  { icon: Folder, name: "Documents", kind: "Folder" },
  { icon: Folder, name: "Projects", kind: "Folder" },
  { icon: FileText, name: "Readme.txt", kind: "Plain Text" },
  { icon: FileText, name: "Notes.md", kind: "Markdown" },
  { icon: ImageIcon, name: "Wallpaper.jpg", kind: "JPEG Image" },
  { icon: ImageIcon, name: "Avatar.png", kind: "PNG Image" },
  { icon: Music, name: "Track 01.mp3", kind: "Audio" },
];

export function Finder() {
  const [selected, setSelected] = useState<string | null>("Readme.txt");
  return (
    <div className="flex h-full text-sm">
      <aside className="w-48 bg-muted/40 border-r p-3 space-y-4">
        {SIDEBAR.map((g) => (
          <div key={g.label}>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1.5 px-1">{g.label}</div>
            <ul className="space-y-0.5">
              {g.items.map((it) => (
                <li key={it.label}>
                  <button className="w-full flex items-center gap-2 px-2 py-1 rounded-md hover:bg-black/5">
                    <it.icon className="w-4 h-4 text-primary" />
                    <span>{it.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>
      <main className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-4 gap-4">
          {FILES.map((f) => (
            <button
              key={f.name}
              onClick={() => setSelected(f.name)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg ${selected === f.name ? "bg-primary/15" : "hover:bg-black/5"}`}
            >
              <f.icon className={`w-12 h-12 ${f.kind === "Folder" ? "text-sky-500" : "text-muted-foreground"}`} />
              <span className="text-xs text-center break-words">{f.name}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
