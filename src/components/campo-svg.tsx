"use client";

import { cn } from "@/lib/utils";

interface CampoSVGProps {
  zonasSeleccionadas: number[];
  onZonaClick?: (zona: number) => void;
  readonly?: boolean;
  className?: string;
}

// 4 filas × 5 columnas = 20 zonas
const GRID_ROWS = 4;
const GRID_COLS = 5;
const W = 300;
const H = 420;
const CELL_W = W / GRID_COLS;
const CELL_H = H / GRID_ROWS;

function getZonaId(row: number, col: number): number {
  return row * GRID_COLS + col + 1;
}

function getZonaLabel(id: number): string {
  return `Z${id}`;
}

const ZONA_LABELS: Record<number, string> = {
  1: "AL", 2: "AC", 3: "AC", 4: "AC", 5: "AR",
  6: "DL", 7: "DC", 8: "DC", 9: "DC", 10: "DR",
  11: "ML", 12: "MC", 13: "MC", 14: "MC", 15: "MR",
  16: "OL", 17: "OC", 18: "OC", 19: "OC", 20: "OR",
};

export default function CampoSVG({ zonasSeleccionadas, onZonaClick, readonly = false, className }: CampoSVGProps) {
  const selSet = new Set(zonasSeleccionadas);

  return (
    <div className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-xs mx-auto rounded-lg border border-green-800"
        style={{ background: "linear-gradient(180deg, #14532d 0%, #166534 50%, #14532d 100%)" }}
      >
        {/* Líneas del campo */}
        {/* Borde */}
        <rect x="8" y="8" width={W - 16} height={H - 16} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" rx="2" />
        {/* Línea de medio campo */}
        <line x1="8" y1={H / 2} x2={W - 8} y2={H / 2} stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        {/* Círculo central */}
        <circle cx={W / 2} cy={H / 2} r="28" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <circle cx={W / 2} cy={H / 2} r="2" fill="rgba(255,255,255,0.5)" />
        {/* Área grande arriba */}
        <rect x={W / 2 - 70} y="8" width="140" height="55" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        {/* Área pequeña arriba */}
        <rect x={W / 2 - 35} y="8" width="70" height="25" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        {/* Área grande abajo */}
        <rect x={W / 2 - 70} y={H - 63} width="140" height="55" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        {/* Área pequeña abajo */}
        <rect x={W / 2 - 35} y={H - 33} width="70" height="25" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

        {/* Zonas clicables */}
        {Array.from({ length: GRID_ROWS }, (_, row) =>
          Array.from({ length: GRID_COLS }, (_, col) => {
            const zonaId = getZonaId(row, col);
            const selected = selSet.has(zonaId);
            const x = col * CELL_W;
            const y = row * CELL_H;
            return (
              <g key={zonaId}>
                <rect
                  x={x + 1}
                  y={y + 1}
                  width={CELL_W - 2}
                  height={CELL_H - 2}
                  fill={selected ? "rgba(34,197,94,0.55)" : "rgba(0,0,0,0.08)"}
                  stroke={selected ? "rgba(134,239,172,0.8)" : "rgba(255,255,255,0.08)"}
                  strokeWidth={selected ? "1.5" : "0.5"}
                  rx="3"
                  className={readonly ? "" : "cursor-pointer hover:fill-green-500/30 transition-all"}
                  onClick={() => !readonly && onZonaClick?.(zonaId)}
                />
                <text
                  x={x + CELL_W / 2}
                  y={y + CELL_H / 2 + 4}
                  textAnchor="middle"
                  fontSize="9"
                  fill={selected ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)"}
                  fontWeight={selected ? "700" : "400"}
                  className="pointer-events-none select-none"
                >
                  {getZonaLabel(zonaId)}
                </text>
              </g>
            );
          })
        )}

        {/* Etiquetas de filas */}
        {["ÁREA PROPIA", "DEFENSA", "MEDIO", "ATAQUE"].map((label, i) => (
          <text
            key={label}
            x={W - 4}
            y={i * CELL_H + CELL_H / 2 + 3}
            textAnchor="end"
            fontSize="6"
            fill="rgba(255,255,255,0.25)"
            className="select-none"
          >
            {label}
          </text>
        ))}
      </svg>

      {!readonly && (
        <p className="text-center text-xs text-slate-500 mt-1">
          Toca las zonas para marcar la influencia del jugador
        </p>
      )}

      {zonasSeleccionadas.length > 0 && (
        <div className="flex flex-wrap gap-1 justify-center mt-2">
          {zonasSeleccionadas.sort((a, b) => a - b).map((z) => (
            <span key={z} className="px-2 py-0.5 bg-green-900/60 text-green-300 text-xs rounded-full border border-green-700/50">
              Z{z}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
