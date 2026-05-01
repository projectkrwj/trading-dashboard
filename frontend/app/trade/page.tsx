"use client";

import { useState } from "react";

type Trade = {
  entry: number;
  exit: number;
  risk: number;
  size: number;
  setup: string;
  note: string;
};

export default function TradePage() {
  const [trade, setTrade] = useState<Trade>({
    entry: 0,
    exit: 0,
    risk: 0,
    size: 0,
    setup: "",
    note: "",
  });

  const [r, setR] = useState<number | null>(null);

  const handleChange = (field: keyof Trade, value: string) => {
    setTrade({
      ...trade,
      [field]:
        field === "setup" || field === "note"
          ? value
          : Number(value),
    });
  };

  const calculateR = () => {
    const pnl = (trade.exit - trade.entry) * trade.size;
    if (trade.risk === 0) return;
    setR(pnl / trade.risk);
  };

  const saveTrade = () => {
    const saved = localStorage.getItem("trades");
    const trades = saved ? JSON.parse(saved) : [];

    trades.push({
      ...trade,
      r,
      date: new Date().toISOString(),
    });

    localStorage.setItem("trades", JSON.stringify(trades));

    alert("Trade saved");

    setTrade({
      entry: 0,
      exit: 0,
      risk: 0,
      size: 0,
      setup: "",
      note: "",
    });
    setR(null);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#f8fafc",
    fontSize: "14px",
  };

  const cardStyle: React.CSSProperties = {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "24px",
    borderRadius: "16px",
    background: "#1c1c1e",
    color: "#f8fafc",
  };

  return (
    <main style={{ padding: "40px", background: "#0b0b0f", minHeight: "100vh" }}>
      <div className="dashboard-card" style={cardStyle}>
        <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>
          Add Trade
        </h2>

        {/* Entry */}
        <input
          type="number"
          placeholder="Entry Price"
          value={trade.entry}
          onChange={(e) => handleChange("entry", e.target.value)}
          style={inputStyle}
        />

        {/* Exit */}
        <input
          type="number"
          placeholder="Exit Price"
          value={trade.exit}
          onChange={(e) => handleChange("exit", e.target.value)}
          style={{ ...inputStyle, marginTop: "10px" }}
        />

        {/* Size */}
        <input
          type="number"
          placeholder="Position Size"
          value={trade.size}
          onChange={(e) => handleChange("size", e.target.value)}
          style={{ ...inputStyle, marginTop: "10px" }}
        />

        {/* Risk */}
        <input
          type="number"
          placeholder="Risk ($)"
          value={trade.risk}
          onChange={(e) => handleChange("risk", e.target.value)}
          style={{ ...inputStyle, marginTop: "10px" }}
        />

        {/* Setup */}
        <input
          type="text"
          placeholder="Setup (e.g. breakout)"
          value={trade.setup}
          onChange={(e) => handleChange("setup", e.target.value)}
          style={{ ...inputStyle, marginTop: "10px" }}
        />

        {/* Note */}
        <textarea
          placeholder="Note"
          value={trade.note}
          onChange={(e) => handleChange("note", e.target.value)}
          style={{ ...inputStyle, marginTop: "10px", height: "80px" }}
        />

        {/* Calculate */}
        <button
          onClick={calculateR}
          style={{
            marginTop: "16px",
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            background: "#3b82f6",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Calculate R
        </button>

        {/* Result */}
        {r !== null && (
          <div
            style={{
              marginTop: "16px",
              fontSize: "18px",
              fontWeight: "bold",
              color: r >= 0 ? "#16a34a" : "#ef4444",
            }}
          >
            R: {r.toFixed(2)}
          </div>
        )}

        {/* Save */}
        <button
          onClick={saveTrade}
          disabled={r === null}
          style={{
            marginTop: "12px",
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            background: r !== null ? "#16a34a" : "#334155",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Save Trade
        </button>
      </div>
    </main>
  );
}