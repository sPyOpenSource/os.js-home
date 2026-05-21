import { DesktopProvider, useDesktop } from "./store";
import { MenuBar } from "./MenuBar";
import { Dock } from "./Dock";
import { Window } from "./Window";
import { Finder } from "./apps/Finder";
import { TextEdit } from "./apps/TextEdit";
import { Calculator } from "./apps/Calculator";
import { Browser } from "./apps/Browser";
import { About } from "./apps/About";
import { Terminal } from "./apps/Terminal";
import { Connection } from "./apps/Connection";

function WindowLayer() {
  const { windows } = useDesktop();
  return (
    <>
      {windows.map((w) => (
        <Window key={w.id} win={w}>
          {w.appId === "finder" && <Finder />}
          {w.appId === "textedit" && <TextEdit />}
          {w.appId === "calculator" && <Calculator />}
          {w.appId === "browser" && <Browser />}
          {w.appId === "about" && <About />}
          {w.appId === "terminal" && <Terminal />}
          {w.appId === "connection" && <Connection />}
        </Window>
      ))}
    </>
  );
}

export function Desktop() {
  return (
    <DesktopProvider>
      <div
        className="fixed inset-0 overflow-hidden"
        style={{
          background:
            "radial-gradient(1200px 800px at 20% 10%, #a8c5ff 0%, transparent 60%)," +
            "radial-gradient(1000px 700px at 80% 90%, #ffb8d0 0%, transparent 55%)," +
            "linear-gradient(135deg, #6aa6ff 0%, #8a7bff 50%, #ff8ec7 100%)",
        }}
      >
        <MenuBar />
        <div className="absolute inset-0 pt-7">
          <WindowLayer />
        </div>
        <Dock />
      </div>
    </DesktopProvider>
  );
}
