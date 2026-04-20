"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Informe, Jugador } from "@/types";
import { promedioMetricas, formatDate, calcularEdad } from "@/lib/utils";

interface ExportPDFButtonProps {
  informe: Informe & { jugadores: Jugador };
}

export default function ExportPDFButton({ informe }: ExportPDFButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const jugador = informe.jugadores;
      const avg = promedioMetricas([informe]);

      const W = doc.internal.pageSize.getWidth();
      const M = 15;
      let y = M;

      // --- HEADER ---
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, W, 35, "F");
      doc.setTextColor(34, 197, 94);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("ScoutPro", M, 18);
      doc.setTextColor(200, 200, 200);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("Informe profesional de scouting", M, 25);
      doc.setFontSize(8);
      doc.text(`Generado: ${formatDate(new Date().toISOString())}`, W - M, 18, { align: "right" });
      doc.text(`ID: ${informe.id.slice(0, 8)}`, W - M, 23, { align: "right" });

      y = 45;

      // --- JUGADOR ---
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(jugador.nombre_completo, M, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      const sub = [
        jugador.posicion_principal,
        jugador.pie_dominante ? `Pie ${jugador.pie_dominante}` : null,
        jugador.club_actual,
        jugador.fecha_nacimiento ? `${calcularEdad(jugador.fecha_nacimiento)} años` : null,
      ].filter(Boolean).join(" · ");
      doc.text(sub, M, y);

      y += 10;

      // --- INFO PARTIDO ---
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(M, y, W - M, y);
      y += 7;
      doc.setTextColor(71, 85, 105);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      const meta = [
        informe.fecha_partido ? `Fecha: ${formatDate(informe.fecha_partido)}` : null,
        informe.rival ? `Rival: ${informe.rival}` : null,
        informe.demarcacion_partido ? `Posición: ${informe.demarcacion_partido}` : null,
        informe.partido_id ? `Ref: ${informe.partido_id}` : null,
      ].filter(Boolean).join("   ");
      doc.text(meta || "Informe sin contexto de partido", M, y);
      y += 10;

      // --- SCORE CARDS ---
      const cardW = (W - M * 2 - 9) / 4;
      const cardH = 25;
      const scoreColors: Array<[number, number, number]> = [
        [34, 197, 94], [59, 130, 246], [168, 85, 247], [245, 158, 11],
      ];
      const scoreData = [
        { label: "TÉCNICA", val: avg.tecnica, color: scoreColors[0] },
        { label: "FÍSICA", val: avg.fisica, color: scoreColors[1] },
        { label: "TÁCTICA", val: avg.tactica, color: scoreColors[2] },
        { label: "GENERAL", val: avg.total, color: scoreColors[3] },
      ];
      scoreData.forEach((s, i) => {
        const x = M + i * (cardW + 3);
        doc.setFillColor(s.color[0], s.color[1], s.color[2]);
        doc.setDrawColor(s.color[0], s.color[1], s.color[2]);
        doc.roundedRect(x, y, cardW, cardH, 2, 2, "FD");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.text(`${s.val}`, x + cardW / 2, y + 13, { align: "center" });
        doc.setFontSize(7);
        doc.text(s.label, x + cardW / 2, y + 20, { align: "center" });
      });
      y += cardH + 10;

      // --- ETIQUETAS ---
      if (informe.etiquetas?.length) {
        doc.setTextColor(15, 23, 42);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("Perfil de juego", M, y);
        y += 5;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(34, 197, 94);
        const text = informe.etiquetas.join("   ");
        const lines = doc.splitTextToSize(text, W - M * 2);
        doc.text(lines, M, y);
        y += lines.length * 5 + 5;
      }

      // --- ZONAS DE ACCIÓN ---
      if (informe.zona_accion?.length) {
        doc.setTextColor(15, 23, 42);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("Zonas de acción en el partido", M, y);
        y += 5;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        const zonas = informe.zona_accion.sort((a, b) => a - b).map((z) => `Z${z}`).join(" · ");
        doc.text(zonas, M, y);
        y += 8;
      }

      // --- TENDENCIAS ---
      if (informe.tendencias_movimiento) {
        doc.setTextColor(15, 23, 42);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("Tendencias de movimiento", M, y);
        y += 5;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85);
        const lines = doc.splitTextToSize(informe.tendencias_movimiento, W - M * 2);
        doc.text(lines, M, y);
        y += lines.length * 4.5 + 6;
      }

      // --- CONCLUSIONES ---
      if (informe.conclusiones) {
        if (y > 240) { doc.addPage(); y = M; }
        doc.setFillColor(241, 245, 249);
        const linesC = doc.splitTextToSize(informe.conclusiones, W - M * 2 - 8);
        const blockH = linesC.length * 4.5 + 12;
        doc.roundedRect(M, y, W - M * 2, blockH, 2, 2, "F");
        doc.setTextColor(15, 23, 42);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("Conclusiones del análisis", M + 4, y + 6);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85);
        doc.text(linesC, M + 4, y + 11);
        y += blockH + 5;
      }

      // --- FOOTER ---
      const pageH = doc.internal.pageSize.getHeight();
      doc.setDrawColor(226, 232, 240);
      doc.line(M, pageH - 15, W - M, pageH - 15);
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(7);
      doc.text("ScoutPro — Plataforma profesional de scouting", M, pageH - 10);
      doc.text(`${formatDate(informe.created_at)}`, W - M, pageH - 10, { align: "right" });

      const safe = jugador.nombre_completo.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");
      doc.save(`informe_${safe}_${informe.id.slice(0, 8)}.pdf`);
    } catch (err) {
      console.error("Error generando PDF:", err);
      alert("Error al generar el PDF: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      title="Exportar a PDF"
      className="flex items-center gap-1.5 px-3 py-2 bg-red-900/40 hover:bg-red-900/60 disabled:bg-slate-800 text-red-300 border border-red-800/40 text-sm rounded-xl transition-all"
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-red-400/20 border-t-red-400 rounded-full animate-spin" />
      ) : (
        <Download size={14} />
      )}
      <span className="hidden sm:inline">{loading ? "..." : "PDF"}</span>
    </button>
  );
}
