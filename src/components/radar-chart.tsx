"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface RadarMetricasProps {
  tecnica: number;
  fisica: number;
  tactica: number;
  className?: string;
}

export default function RadarMetricas({ tecnica, fisica, tactica, className }: RadarMetricasProps) {
  const data = [
    { metrica: "Técnica", valor: tecnica, fullMark: 10 },
    { metrica: "Táctica", valor: tactica, fullMark: 10 },
    { metrica: "Física", valor: fisica, fullMark: 10 },
  ];

  return (
    <div className={className} style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis
            dataKey="metrica"
            tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
          />
          <Tooltip
            contentStyle={{
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#f1f5f9",
              fontSize: 13,
            }}
            formatter={(v) => [`${v}/10`, ""] as [string, string]}
          />
          <Radar
            dataKey="valor"
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.25}
            strokeWidth={2}
            dot={{ fill: "#22c55e", r: 4 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
