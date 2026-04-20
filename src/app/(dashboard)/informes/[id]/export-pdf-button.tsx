"use client";

import { useState } from "react";
import { Download } from "lucide-react";

interface ExportPDFButtonProps {
  informeId: string;
  jugadorNombre: string;
}

export default function ExportPDFButton({ informeId, jugadorNombre }: ExportPDFButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");

      const element = document.getElementById("informe-pdf");
      if (!element) return;

      const canvas = await html2canvas(element, {
        backgroundColor: "#0f172a",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const nombreSafe = jugadorNombre.replace(/\s+/g, "_");
      pdf.save(`informe_${nombreSafe}_${informeId.slice(0, 8)}.pdf`);
    } catch (err) {
      console.error("Error generando PDF:", err);
      alert("Error al generar el PDF. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      title="Exportar a PDF"
      className="flex items-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white text-sm rounded-xl transition-all"
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      ) : (
        <Download size={14} />
      )}
      <span className="hidden sm:inline">{loading ? "Exportando..." : "PDF"}</span>
    </button>
  );
}
