"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
type AssetPoint = {
  date: string;
  total_asset: number;
};
export default function HomePage() {
  const [data, setData] = useState<AssetPoint[]>([]);
  const current = data.length ? data[data.length - 1].total_asset : 0
  const first = data.length ? data[0].total_asset : 0
  const pnl = current - first
  const pnlPercent = first ? (pnl / first) * 100 : 0

  useEffect(() => {
    fetch("https://improved-adventure-jxr65r4w944h5rx9-8000.app.github.dev/history")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  return (
    <main style={{ padding: "40px" }}>
      <h1>Asset History</h1>
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "14px", color: "#888" }}>
          Est total value
        </div>

        <div style={{ fontSize: "32px", fontWeight: "bold" }}>
          {current.toFixed(2)} USD
        </div>

        <div
          style={{
            marginTop: "8px",
            color: pnl >= 0 ? "green" : "red",
          }}
        >
          6M PnL {pnl >= 0 ? "+" : ""}
          ${pnl.toFixed(2)} ({pnlPercent.toFixed(2)}%)
        </div>
      </div>

      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total_asset" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}