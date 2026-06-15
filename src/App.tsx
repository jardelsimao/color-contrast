import { useState, useMemo } from "react";
import "./App.css";
import { ContrastText } from "./components/ContrastText";
import {
  contrastForeground,
  relativeLuminance,
  luminanceLabel,
} from "./utils/colorContrast";

const PRESETS = [
  "#1e1e2e",
  "#11111b",
  "#313244",
  "#45475a",
  "#f38ba8",
  "#eba0ac",
  "#fab387",
  "#f9e2af",
  "#a6e3a1",
  "#94e2d5",
  "#89dceb",
  "#74c7ec",
  "#89b4fa",
  "#b4befe",
  "#cba6f7",
  "#f5c2e7",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

function App() {
  const [r, setR] = useState(100);
  const [g, setG] = useState(120);
  const [b, setB] = useState(200);

  const hex = useMemo(
    () => `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`,
    [r, g, b],
  );

  const lum = useMemo(() => relativeLuminance(r, g, b), [r, g, b]);
  const fg = useMemo(() => contrastForeground(r, g, b), [r, g, b]);

  const handleColorPicker = (hexVal: string) => {
    const rr = parseInt(hexVal.slice(1, 3), 16);
    const gg = parseInt(hexVal.slice(3, 5), 16);
    const bb = parseInt(hexVal.slice(5, 7), 16);
    setR(rr);
    setG(gg);
    setB(bb);
  };

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <h1>Smart contrast</h1>
        <p>
          A reusable component that picks white or black text based on
          WCAG&nbsp;2.1 relative luminance — just math, zero AI.
        </p>
      </header>

      {/* ── Picker ── */}
      <div className="picker-card">
        <div>
          <label>Picker</label>
          <div className="color-input-row">
            <input
              type="color"
              value={hex}
              onChange={(e) => handleColorPicker(e.target.value)}
            />
            <input
              type="text"
              value={hex}
              onChange={(e) => {
                const v = e.target.value;
                if (/^#[0-9a-fA-F]{6}$/.test(v)) handleColorPicker(v);
              }}
            />
          </div>
        </div>

        <div className="sliders">
          {(
            [
              { label: "R", val: r, set: setR, color: "#ef4444" },
              { label: "G", val: g, set: setG, color: "#22c55e" },
              { label: "B", val: b, set: setB, color: "#3b82f6" },
            ] as const
          ).map((ch) => (
            <div className="slider-group" key={ch.label}>
              <span style={{ color: ch.color, fontWeight: 700 }}>
                {ch.label}
              </span>
              <input
                type="range"
                min={0}
                max={255}
                value={ch.val}
                onChange={(e) => ch.set(+e.target.value)}
                style={{
                  background: `linear-gradient(90deg, #000, ${ch.color})`,
                }}
              />
              <span className="val">{ch.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Live preview ── */}
      <div className="live-preview">
        <ContrastText
          bgColor={hex}
          style={{ fontSize: "1.4rem", minHeight: 100, borderRadius: 14 }}
        >
          {fg === "#FFFFFF" ? "White" : "Black"} text on {hex}
        </ContrastText>
      </div>

      {/* ── Stats ── */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Luminance</div>
          <div className="stat-value">{lum.toFixed(4)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Category</div>
          <div className="stat-value">{luminanceLabel(lum)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Chosen text</div>
          <div
            className="stat-value"
            style={{
              color: fg,
              background: hex,
              padding: "0.2rem 0.6rem",
              borderRadius: 6,
            }}
          >
            {fg}
          </div>
        </div>
      </div>

      {/* ── Preset grid ── */}
      <h2 className="section-title">Reference palette</h2>
      <div className="color-grid">
        {PRESETS.map((c) => (
          <ContrastText key={c} bgColor={c} style={{ fontSize: "0.85rem" }}>
            {c}
          </ContrastText>
        ))}
      </div>

      {/* ── Theme-class demo ── */}
      <h2 className="section-title" style={{ marginTop: "2rem" }}>
        With theme classes
      </h2>
      <p
        style={{
          color: "#71717a",
          fontSize: "0.85rem",
          marginBottom: "1rem",
        }}
      >
        Same component, now using{" "}
        <code style={{ color: "#a78bfa" }}>lightClass</code> /{" "}
        <code style={{ color: "#a78bfa" }}>darkClass</code> instead of inline
        colors — perfect for Tailwind, CSS Modules, or any design system.
      </p>
      <div className="color-grid">
        {PRESETS.slice(0, 8).map((c) => (
          <ContrastText
            key={c}
            bgColor={c}
            lightClass="theme-light"
            darkClass="theme-dark"
            style={{ fontSize: "0.85rem" }}
          >
            {c}
          </ContrastText>
        ))}
      </div>

      <footer className="app-footer">
        WCAG 2.1 · L = 0.2126R + 0.7152G + 0.0722B · limiar ≈ 0.18
      </footer>
    </div>
  );
}

export default App;
