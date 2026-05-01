"use client";

import { useEffect, useState } from "react";
import {
  ComposedChart,
  Line,
  Area,
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
  const [range, setRange] = useState("6M");
  const filteredData = data.slice(
    range === "1M" ? -30 :
    range === "3M" ? -90 :
    range === "6M" ? -180 :
    -365
  );

  const current = filteredData.length
    ? filteredData[filteredData.length - 1].total_asset
    : 0;

  const first = filteredData.length
    ? filteredData[0].total_asset
    : 0;

  const pnl = current - first;
  const pnlPercent = first ? (pnl / first) * 100 : 0;

  // 목표 수익률
  const [goal, setGoal] = useState(10);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState("10");

  const progress = first ? (pnlPercent / goal) * 100 : 0;
  const remain = goal - pnlPercent;

  // ATH 계산
  const ath = data.length
    ? Math.max(...data.map((d) => d.total_asset))
    : 0;

  // 현재 기준 Drawdown
  const drawdown = ath ? ((current - ath) / ath) * 100 : 0;

  // Max Drawdown 계산 (핵심)
  let peak = -Infinity;
  let maxDD = 0;

  for (const point of data) {
    if (point.total_asset > peak) peak = point.total_asset;
    const dd = (point.total_asset - peak) / peak;
    if (dd < maxDD) maxDD = dd;
  }

  const maxDrawdown = maxDD * 100;

  // 이번 달 시작값 (간단 버전: filteredData 기준)
  const monthStart = filteredData.length ? filteredData[0].total_asset : 0;
  const monthPnL = current - monthStart;
  const monthPnLPercent = monthStart ? (monthPnL / monthStart) * 100 : 0;



  useEffect(() => {
    fetch("https://improved-adventure-jxr65r4w944h5rx9-8000.app.github.dev/history")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);
  useEffect(() => {
    const savedGoal = localStorage.getItem("monthlyGoal");
    if (savedGoal) {
      setGoal(Number(savedGoal));
      setGoalInput(savedGoal);
    }
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
            {range} PnL {pnl >= 0 ? "+" : ""}
            ${pnl.toFixed(2)} ({pnlPercent.toFixed(2)}%)
          </div>
        </div>

        {/* 오른쪽 카드: 목표 진행 */}
        <div className="dashboard-card" style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: "bold" }}>
              Monthly Goal: {goal}%
            </div>

            {!editingGoal && (
              <button
                onClick={() => setEditingGoal(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#3b82f6",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Modify
              </button>
            )}
          </div>

          {editingGoal ? (
            <div style={{ marginTop: "20px" }}>
              <input
                type="number"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #334155",
                  background: "#0f172a",
                  color: "#f8fafc",
                  fontSize: "16px",
                  outline: "none",
                }}
              />

              <button
                onClick={() => {
                  setGoal(Number(goalInput));
                  localStorage.setItem("monthlyGoal", goalInput);
                  setEditingGoal(false);
                }}
                style={{
                  marginTop: "12px",
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
                Save
              </button>
            </div>
          ) : (
            <>
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: "bold",
                  marginTop: "20px",
                }}
              >
                {pnlPercent.toFixed(2)}%
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
                  color: "#94a3b8",
                }}
              >
                {remain > 0
                  ? `${remain.toFixed(2)}% to go`
                  : "Goal achieved"}
              </div>
            </>
          )}
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div style={{ fontSize: "18px", fontWeight: "bold", color: "#f8fafc" }}>
          Asset Trend ({range})
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          {["1M", "3M", "6M", "1Y"].map((item) => (
            <button
              key={item}
              onClick={() => setRange(item)}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background: range === item ? "#3b82f6" : "#334155",
                color: "white",
                fontWeight: "bold",
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer>
        <ComposedChart data={filteredData}>
          <defs>
            <linearGradient id="colorAsset" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.6} /> 
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} /> 
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#2c2c2e" strokeDasharray="3 3" />
          
          <XAxis
            dataKey="date"
            stroke="#8e8e93"
            tick={{ fill: "#8e8e93", fontSize: 12 }}
          />

          <YAxis
            stroke="#8e8e93"
            tick={{ fill: "#8e8e93", fontSize: 12 }}
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
          <Area
            type="monotone"
            dataKey="total_asset"
            stroke="#0a84ff"
            fill="url(#colorAsset)"
            fillOpacity={1}
            tooltipType="none"
          />
          <Line 
            type="monotone" 
            dataKey="total_asset"
            name="Asset Value"
            stroke="#0a84ff"   // iOS 블루
            strokeWidth={3}
            dot={false}        // 애플 느낌 (점 제거)
            activeDot={{
              r: 5,
              stroke: "#0a84ff",
              strokeWidth: 2,
              fill: "#1c1c1e", 
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  {/* 하단 KPI 카드 */}
  <div
    style={{
      display: "flex",
      gap: "16px",
      marginTop: "24px",
    }}
  >
    {/* This Month */}
    <div className="dashboard-card" style={cardStyle}>
      <div style={{ fontSize: "16px", color: "#94a3b8" }}>
        This Month
      </div>

      <div
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginTop: "8px",
          color: monthPnL >= 0 ? "#16a34a" : "#ef4444",
        }}
      >
        {monthPnLPercent.toFixed(2)}%
      </div>

      <div style={{ fontSize: "14px", marginTop: "6px", color: "#94a3b8" }}>
        ${monthPnL.toFixed(2)}
      </div>
    </div>

    {/* ATH */}
    <div className="dashboard-card" style={cardStyle}>
      <div style={{ fontSize: "16px", color: "#94a3b8" }}>
        ATH
      </div>

      <div
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginTop: "8px",
        }}
      >
        ${ath.toFixed(2)}
      </div>

      <div
        style={{
          fontSize: "14px",
          marginTop: "6px",
          color: drawdown >= 0 ? "#16a34a" : "#ef4444",
        }}
      >
        {drawdown.toFixed(2)}% from ATH
      </div>
    </div>

    {/* Drawdown */}
    <div className="dashboard-card" style={cardStyle}>
      <div style={{ fontSize: "16px", color: "#94a3b8" }}>
        Drawdown
      </div>

      <div
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginTop: "8px",
          color: "#ef4444",
        }}
      >
        {drawdown.toFixed(2)}%
      </div>

      <div style={{ fontSize: "14px", marginTop: "6px", color: "#94a3b8" }}>
        Max: {maxDrawdown.toFixed(2)}%
      </div>
    </div>
  </div>

    </main>
  );
}