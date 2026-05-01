"use client";

import { useState } from "react";

type Trade = {
  side: "long" | "short";
  capital: number | "";
  riskPercent: number | "";
  entry: number | "";
  stop: number | "";
  leverage: number;
};

export default function TradePage() {
  const [trade, setTrade] = useState<Trade>({
    side: "long",
    capital: "",
    riskPercent: "",
    entry: "",
    stop: "",
    leverage: 1,
  });

  const handleChange = (field: keyof Trade, value: string) => {
    setTrade({
      ...trade,
      [field]: value === "" ? "" : Number(value),
    });
  };

  // 🔥 포지션 계산
  const calculatePosition = () => {
    if (
      trade.capital === "" ||
      trade.riskPercent === "" ||
      trade.entry === "" ||
      trade.stop === ""
    )
      return null;

    const riskAmount = trade.capital * (trade.riskPercent / 100);
    const stopDistance = Math.abs(trade.entry - trade.stop);

    if (stopDistance === 0) return null;

    const size = riskAmount / stopDistance;

    return {
      size,
      riskAmount,
    };
  };

  const result = calculatePosition();

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
          Position Calculator
        </h2>

        {/* 방향 */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
          <button
            onClick={() => setTrade({ ...trade, side: "long" })}
            style={{
              flex: 1,
              padding: "10px",
              background: trade.side === "long" ? "#16a34a" : "#334155",
              color: "white",
              border: "none",
              borderRadius: "8px",
            }}
          >
            Long
          </button>

          <button
            onClick={() => setTrade({ ...trade, side: "short" })}
            style={{
              flex: 1,
              padding: "10px",
              background: trade.side === "short" ? "#ef4444" : "#334155",
              color: "white",
              border: "none",
              borderRadius: "8px",
            }}
          >
            Short
          </button>
        </div>

        {/* 레버리지 */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "13px", color: "#94a3b8" }}>
            Leverage
          </div>
          <input
            type="range"
            min={1}
            max={125}
            value={trade.leverage}
            onChange={(e) =>
              setTrade({ ...trade, leverage: Number(e.target.value) })
            }
            style={{ width: "100%" }}
          />
          <div style={{ textAlign: "right" }}>{trade.leverage}x</div>
        </div>

        {/* 계좌 */}
        <input
          type="number"
          placeholder="Capital ($)"
          value={trade.capital}
          onChange={(e) => handleChange("capital", e.target.value)}
          style={inputStyle}
        />

        {/* 리스크 % */}
        <input
          type="number"
          placeholder="Risk % (예: 1)"
          value={trade.riskPercent}
          onChange={(e) => handleChange("riskPercent", e.target.value)}
          style={{ ...inputStyle, marginTop: "10px" }}
        />

        {/* Entry */}
        <input
          type="number"
          placeholder="Entry Price"
          value={trade.entry}
          onChange={(e) => handleChange("entry", e.target.value)}
          style={{ ...inputStyle, marginTop: "10px" }}
        />

        {/* Stop */}
        <input
          type="number"
          placeholder="Stop Price (손절가)"
          value={trade.stop}
          onChange={(e) => handleChange("stop", e.target.value)}
          style={{ ...inputStyle, marginTop: "10px" }}
        />

        {/* 결과 */}
        {result && (
          <div style={{ marginTop: "20px" }}>
            <div>
              Position Size: <b>{result.size.toFixed(4)}</b>
            </div>
            <div>
              Risk Amount: <b>${result.riskAmount.toFixed(2)}</b>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}