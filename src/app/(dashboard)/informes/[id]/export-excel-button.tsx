"use client";

import { useState } from "react";
import { FileSpreadsheet } from "lucide-react";
import { Informe, Jugador } from "@/types";
import { promedioMetricas, formatDate, calcularEdad } from "@/lib/utils";

interface ExportExcelButtonProps {
  informe: Informe & { jugadores: Jugador };
}

export default function ExportExcelButton({ informe }: ExportExcelButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const XLSX = await import("xlsx");
      const jugador = informe.jugadores;
      const avg = promedioMetricas([informe]);

      const resumen: Array<[string, string | number | null | undefined]> = [
        ["INFORME DE SCOUTING", ""],
        ["ID Informe", informe.id],
        ["Generado", formatDate(new Date().toISOString())],
        ["", ""],
        ["— JUGADOR —", ""],
        ["Nombre", jugador.nombre_completo],
        ["Posición principal", jugador.posicion_principal || ""],
        ["Pie dominante", jugador.pie_dominante || ""],
        ["Club actual", jugador.club_actual || ""],
        ["Fecha nacimiento", jugador.fecha_nacimiento ? formatDate(jugador.fecha_nacimiento) : ""],
        ["Edad", jugador.fecha_nacimiento ? calcularEdad(jugador.fecha_nacimiento) : ""],
        ["Altura (cm)", jugador.altura_cm ?? ""],
        ["Nacionalidad", jugador.nacionalidad || ""],
        ["Teléfono", jugador.telefono || ""],
        ["Email", jugador.email || ""],
        ["Contacto familiar", jugador.contacto_familiar || ""],
        ["Contacto manager", jugador.contacto_manager || ""],
        ["", ""],
        ["— PARTIDO —", ""],
        ["Fecha partido", informe.fecha_partido ? formatDate(informe.fecha_partido) : ""],
        ["Rival", informe.rival || ""],
        ["Demarcación en partido", informe.demarcacion_partido || ""],
        ["Referencia partido", informe.partido_id || ""],
        ["", ""],
        ["— VALORACIÓN —", ""],
        ["Métrica Técnica", informe.metrica_tecnica],
        ["Métrica Física", informe.metrica_fisica],
        ["Métrica Táctica", informe.metrica_tactica],
        ["Promedio Técnica", avg.tecnica],
        ["Promedio Física", avg.fisica],
        ["Promedio Táctica", avg.tactica],
        ["Valoración General", avg.total],
        ["", ""],
        ["— PERFIL DE JUEGO —", ""],
        ["Etiquetas", (informe.etiquetas || []).join(", ")],
        ["Zonas de acción", (informe.zona_accion || []).sort((a, b) => a - b).map((z) => `Z${z}`).join(", ")],
        ["", ""],
        ["— ANÁLISIS —", ""],
        ["Tendencias de movimiento", informe.tendencias_movimiento || ""],
        ["Conclusiones", informe.conclusiones || ""],
      ];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(resumen);
      ws["!cols"] = [{ wch: 28 }, { wch: 70 }];
      XLSX.utils.book_append_sheet(wb, ws, "Informe");

      const safe = jugador.nombre_completo.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");
      XLSX.writeFile(wb, `informe_${safe}_${informe.id.slice(0, 8)}.xlsx`);
    } catch (err) {
      console.error("Error generando Excel:", err);
      alert("Error al generar el Excel: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      title="Exportar a Excel"
      className="flex items-center gap-1.5 px-3 py-2 bg-emerald-900/40 hover:bg-emerald-900/60 disabled:bg-slate-800 text-emerald-300 border border-emerald-800/40 text-sm rounded-xl transition-all"
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin" />
      ) : (
        <FileSpreadsheet size={14} />
      )}
      <span className="hidden sm:inline">{loading ? "..." : "Excel"}</span>
    </button>
  );
}
