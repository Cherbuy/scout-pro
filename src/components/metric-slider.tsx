"use client";

import { cn } from "@/lib/utils";

interface MetricSliderProps {
  label: string;
  value: number;
  onChange?: (v: number) => void;
  color?: "green" | "blue" | "purple";
  readonly?: boolean;
}

const COLOR_MAP = {
  green: { track: "bg-green-500", text: "text-green-400", badge: "bg-green-900/60 text-green-300 border-green-700/50" },
  blue: { track: "bg-blue-500", text: "text-blue-400", badge: "bg-blue-900/60 text-blue-300 border-blue-700/50" },
  purple: { track: "bg-purple-500", text: "text-purple-400", badge: "bg-purple-900/60 text-purple-300 border-purple-700/50" },
};

export default function MetricSlider({ label, value, onChange, color = "green", readonly = false }: MetricSliderProps) {
  const c = COLOR_MAP[color];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className={cn("text-sm font-medium", c.text)}>{label}</label>
        <span className={cn("px-2 py-0.5 rounded-full text-sm font-bold border", c.badge)}>
          {value}<span className="font-normal text-xs opacity-60">/10</span>
        </span>
      </div>

      {readonly ? (
        <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={cn("absolute left-0 top-0 h-full rounded-full transition-all", c.track)}
            style={{ width: `${value * 10}%` }}
          />
        </div>
      ) : (
        <input
          type="range"
          min={1}
          max={10}
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-700 accent-green-500"
          style={{ accentColor: color === "green" ? "#22c55e" : color === "blue" ? "#3b82f6" : "#a855f7" }}
        />
      )}
    </div>
  );
}
