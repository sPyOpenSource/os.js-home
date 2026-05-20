import { useState } from "react";

type Op = "+" | "-" | "×" | "÷" | null;

export function Calculator() {
  const [display, setDisplay] = useState("0");
  const [acc, setAcc] = useState<number | null>(null);
  const [op, setOp] = useState<Op>(null);
  const [fresh, setFresh] = useState(true);

  const press = (d: string) => {
    if (fresh) { setDisplay(d === "." ? "0." : d); setFresh(false); return; }
    if (d === "." && display.includes(".")) return;
    setDisplay(display.length >= 10 ? display : display + d);
  };

  const apply = (a: number, b: number, o: Op) => {
    switch (o) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b === 0 ? NaN : a / b;
      default: return b;
    }
  };

  const setOpKey = (next: Op) => {
    const cur = parseFloat(display);
    if (acc === null) setAcc(cur);
    else if (!fresh && op) {
      const r = apply(acc, cur, op);
      setAcc(r);
      setDisplay(String(+r.toFixed(8)));
    }
    setOp(next);
    setFresh(true);
  };

  const equals = () => {
    if (op === null || acc === null) return;
    const r = apply(acc, parseFloat(display), op);
    setDisplay(String(+r.toFixed(8)));
    setAcc(null); setOp(null); setFresh(true);
  };

  const clear = () => { setDisplay("0"); setAcc(null); setOp(null); setFresh(true); };

  const Btn = ({ label, onClick, variant = "num", wide }: { label: string; onClick: () => void; variant?: "num" | "fn" | "op"; wide?: boolean }) => (
    <button
      onClick={onClick}
      className={`h-14 rounded-full text-lg font-medium active:opacity-70 transition ${wide ? "col-span-2" : ""} ${
        variant === "num" ? "bg-zinc-700 text-white hover:bg-zinc-600" :
        variant === "fn" ? "bg-zinc-400 text-black hover:bg-zinc-300" :
        "bg-orange-500 text-white hover:bg-orange-400"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="h-full bg-zinc-900 p-3 flex flex-col gap-2">
      <div className="text-right text-white text-5xl font-light px-3 py-4 tabular-nums truncate">{display}</div>
      <div className="grid grid-cols-4 gap-2">
        <Btn label="AC" variant="fn" onClick={clear} />
        <Btn label="+/−" variant="fn" onClick={() => setDisplay(String(-parseFloat(display)))} />
        <Btn label="%" variant="fn" onClick={() => setDisplay(String(parseFloat(display) / 100))} />
        <Btn label="÷" variant="op" onClick={() => setOpKey("÷")} />
        <Btn label="7" onClick={() => press("7")} />
        <Btn label="8" onClick={() => press("8")} />
        <Btn label="9" onClick={() => press("9")} />
        <Btn label="×" variant="op" onClick={() => setOpKey("×")} />
        <Btn label="4" onClick={() => press("4")} />
        <Btn label="5" onClick={() => press("5")} />
        <Btn label="6" onClick={() => press("6")} />
        <Btn label="−" variant="op" onClick={() => setOpKey("-")} />
        <Btn label="1" onClick={() => press("1")} />
        <Btn label="2" onClick={() => press("2")} />
        <Btn label="3" onClick={() => press("3")} />
        <Btn label="+" variant="op" onClick={() => setOpKey("+")} />
        <Btn label="0" onClick={() => press("0")} wide />
        <Btn label="." onClick={() => press(".")} />
        <Btn label="=" variant="op" onClick={equals} />
      </div>
    </div>
  );
}
