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

  const current = data.length ? data[data.length - 1].total_asset : 0;
  const first = data.length ? data[0].total_asset : 0;
  const pnl = current - first;
  const pnlPercent = first ? (pnl / first) * 100 : 0;

  // 임시 목표 수익률
  const goal = 10;
  const progress = first ? (pnlPercent / goal) * 100 : 0;
  const remain = goal - pnlPercent;

  useEffect(() => {
    fetch("https://improved-adventure-jxr65r4w944h5rx9-8000.app.github.dev/history")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  const cardStyle: React.CSSProperties = {
    flex: 1,
    padding: "24px",
    borderRadius: "16px",
    background: "#1c1c1e",
    color: "#f8fafc",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  };

  return (
    <main style={{ padding: "40px", background: "#0b0b0f", minHeight: "100vh" }}>
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {/* 왼쪽 카드: 자산 현황 */}
        <div className="dashboard-card" style={cardStyle}>
          <div style={{ fontSize: "20px", fontWeight: "bold" }}>
            Asset History
          </div>

          <div style={{ marginTop: "12px", fontSize: "14px", color: "#94a3b8" }}>
            Est total value
          </div>

          <div style={{ fontSize: "32px", fontWeight: "bold", marginTop: "4px" }}>
            {current.toFixed(2)} USD
          </div>

          <div
            style={{
              marginTop: "12px",
              color: pnl >= 0 ? "green" : "red",
              fontSize: "16px",
              fontWeight: 500,
            }}
          >
            6M PnL {pnl >= 0 ? "+" : ""}
            ${pnl.toFixed(2)} ({pnlPercent.toFixed(2)}%)
          </div>
        </div>

        {/* 오른쪽 카드: 목표 진행 */}
        <div className="dashboard-card" style={cardStyle}>
          <div style={{ fontSize: "20px", fontWeight: "bold" }}>
            Monthly Goal
          </div>

          <div
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              marginTop: "20px",
            }}
          >
            {progress.toFixed(0)}%
          </div>

          <div
            style={{
              height: "10px",
              background: "#334155",
              borderRadius: "999px",
              overflow: "hidden",
              marginTop: "14px",
            }}
          >
            <div
              style={{
                width: `${Math.min(progress, 100)}%`,
                height: "100%",
                background: progress >= 100 ? "#16a34a" : "#3b82f6",
              }}
            />
          </div>

          <div
            style={{
              marginTop: "12px",
              fontSize: "14px",
              color: "#666",
            }}
          >
            {remain > 0
              ? `${remain.toFixed(2)}% to go`
              : "Goal achieved"}
          </div>
        </div>
      </div>

      {/* 그래프 */}
      <div
        className="dashboard-card"
        style={{
          width: "100%",
          height: 400,
          padding: "24px",
          borderRadius: "16px",
          background: "#1c1c1e", // iOS 카드 색
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
        }}
    >
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid stroke="#2c2c2e" strokeDasharray="3 3" />
          
          <XAxis 
            dataKey="date" 
            stroke="#8e8e93"   // iOS 회색 텍스트
          />
          
          <YAxis 
            stroke="#8e8e93"
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(28, 28, 30, 0.9)",
              border: "1px solid #3a3a3c",
              borderRadius: "12px",
              color: "#f5f5f7",
            }}
            labelStyle={{ color: "#f5f5f7" }}
          />

          <Line 
            type="monotone" 
            dataKey="total_asset" 
            stroke="#0a84ff"   // iOS 블루
            strokeWidth={3}
            dot={false}        // 애플 느낌 (점 제거)
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
    </main>
  );
}