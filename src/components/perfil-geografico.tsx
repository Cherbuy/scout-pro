"use client";

import CampoSVG from "./campo-svg";
import { MapPin, TrendingUp, Layers } from "lucide-react";
import { POSICIONES } from "@/types";

interface PerfilGeograficoProps {
  demarcacionPrincipal: string;
  setDemarcacionPrincipal: (v: string) => void;
  demarcacionSecundaria: string;
  setDemarcacionSecundaria: (v: string) => void;
  zonasInfluencia: number[];
  setZonasInfluencia: (v: number[]) => void;
  tendenciasMovimiento: string;
  setTendenciasMovimiento: (v: string) => void;
  readonly?: boolean;
}

export default function PerfilGeografico({
  demarcacionPrincipal,
  setDemarcacionPrincipal,
  demarcacionSecundaria,
  setDemarcacionSecundaria,
  zonasInfluencia,
  setZonasInfluencia,
  tendenciasMovimiento,
  setTendenciasMovimiento,
  readonly = false,
}: PerfilGeograficoProps) {
  const toggleZona = (zona: number) => {
    if (zonasInfluencia.includes(zona)) {
      setZonasInfluencia(zonasInfluencia.filter((z) => z !== zona));
    } else {
      setZonasInfluencia([...zonasInfluencia, zona]);
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 space-y-5">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-900/60 border border-blue-700/50 flex items-center justify-center">
          <MapPin size={15} className="text-blue-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Perfil Geográfico del Jugador</h3>
          <p className="text-xs text-slate-500">Posicionamiento y zonas de influencia</p>
        </div>
      </div>

      {/* Demarcaciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <Layers size={12} className="text-blue-400" />
            Demarcación Principal
          </label>
          {readonly ? (
            <p className="px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-white">
              {demarcacionPrincipal || "—"}
            </p>
          ) : (
            <select
              value={demarcacionPrincipal}
              onChange={(e) => setDemarcacionPrincipal(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">Seleccionar posición...</option>
              {POSICIONES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <Layers size={12} className="text-slate-400" />
            Demarcación Secundaria
          </label>
          {readonly ? (
            <p className="px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-white">
              {demarcacionSecundaria || "—"}
            </p>
          ) : (
            <select
              value={demarcacionSecundaria}
              onChange={(e) => setDemarcacionSecundaria(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">Ninguna / No definida</option>
              {POSICIONES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          )}
        </div>
      </div>

      {/* Mapa de Calor Descriptivo */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <MapPin size={12} className="text-green-400" />
          Mapa de Calor — Zonas de Mayor Influencia
        </label>
        <p className="text-xs text-slate-500">
          El campo está dividido en 20 zonas. Selecciona las áreas donde el jugador tiene mayor presencia.
        </p>
        <CampoSVG
          zonasSeleccionadas={zonasInfluencia}
          onZonaClick={readonly ? undefined : toggleZona}
          readonly={readonly}
        />
      </div>

      {/* Tendencias de Movimiento */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <TrendingUp size={12} className="text-purple-400" />
          Tendencias de Movimiento Sin Balón
        </label>
        {readonly ? (
          <p className="px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-slate-300 whitespace-pre-wrap min-h-[60px]">
            {tendenciasMovimiento || "Sin datos registrados"}
          </p>
        ) : (
          <textarea
            value={tendenciasMovimiento}
            onChange={(e) => setTendenciasMovimiento(e.target.value)}
            rows={3}
            placeholder="Ej: Tiende a hacer diagonal hacia el interior desde la banda izquierda. Busca el espacio entre líneas cuando el equipo tiene el balón..."
            className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
          />
        )}
      </div>
    </div>
  );
}
