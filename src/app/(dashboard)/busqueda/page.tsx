"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Search, Users, SlidersHorizontal } from "lucide-react";
import { POSICIONES, ETIQUETAS_PREDEFINIDAS, Jugador, Informe } from "@/types";
import { promedioMetricas, getColorValoracion } from "@/lib/utils";

interface JugadorResult extends Jugador {
  informes: Informe[];
}

export default function BusquedaPage() {
  const [posicion, setPosicion] = useState("");
  const [pie, setPie] = useState("");
  const [etiqueta, setEtiqueta] = useState("");
  const [zona, setZona] = useState("");
  const [valoracionMin, setValoracionMin] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState<JugadorResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase
      .from("jugadores")
      .select("*, informes(metrica_tecnica, metrica_fisica, metrica_tactica, etiquetas, zona_accion)")
      .eq("user_id", user!.id);

    if (posicion) query = query.eq("posicion_principal", posicion);
    if (pie) query = query.eq("pie_dominante", pie);
    if (busqueda) query = query.ilike("nombre_completo", `%${busqueda}%`);
    if (zona) query = query.contains("zonas_influencia", [parseInt(zona)]);

    const { data } = await query;
    let filtered = data || [];

    if (etiqueta) {
      filtered = filtered.filter((j: JugadorResult) =>
        j.informes?.some((inf: Informe) => inf.etiquetas?.includes(etiqueta))
      );
    }

    if (valoracionMin > 1) {
      filtered = filtered.filter((j: JugadorResult) => {
        if (!j.informes?.length) return false;
        const avg = promedioMetricas(j.informes).total;
        return avg >= valoracionMin;
      });
    }

    setResultados(filtered);
    setLoading(false);
  };

  const limpiar = () => {
    setPosicion(""); setPie(""); setEtiqueta(""); setZona(""); setValoracionMin(1); setBusqueda("");
    setResultados(null);
  };

  return (
    <div className="space-y-5 py-2 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Búsqueda Avanzada</h1>
        <p className="text-slate-400 text-sm mt-0.5">Encuentra jugadores por criterios específicos</p>
      </div>

      {/* Formulario de búsqueda */}
      <form onSubmit={handleBuscar} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <SlidersHorizontal size={14} className="text-green-400" />
          <h2 className="text-sm font-semibold text-white">Filtros de búsqueda</h2>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400">Nombre del jugador</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Posición</label>
            <select value={posicion} onChange={(e) => setPosicion(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-green-500 transition-colors">
              <option value="">Todas</option>
              {POSICIONES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Pie dominante</label>
            <select value={pie} onChange={(e) => setPie(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-green-500 transition-colors">
              <option value="">Cualquiera</option>
              <option value="Derecho">Derecho</option>
              <option value="Izquierdo">Izquierdo</option>
              <option value="Ambidiestro">Ambidiestro</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Tiene etiqueta</label>
            <select value={etiqueta} onChange={(e) => setEtiqueta(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-green-500 transition-colors">
              <option value="">Cualquiera</option>
              {ETIQUETAS_PREDEFINIDAS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Zona de influencia</label>
            <select value={zona} onChange={(e) => setZona(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-green-500 transition-colors">
              <option value="">Cualquier zona</option>
              {Array.from({ length: 20 }, (_, i) => i + 1).map((z) => (
                <option key={z} value={z}>Zona {z}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-400">Valoración mínima</label>
            <span className="text-sm font-bold text-green-400">{valoracionMin === 1 ? "Sin mínimo" : `≥ ${valoracionMin}`}</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            step={0.5}
            value={valoracionMin}
            onChange={(e) => setValoracionMin(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-700"
            style={{ accentColor: "#22c55e" }}
          />
          <div className="flex justify-between text-xs text-slate-600">
            <span>Sin mínimo</span>
            <span>10</span>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button type="submit" disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-400 disabled:bg-green-800 text-slate-900 font-semibold text-sm rounded-xl transition-all">
            {loading ? <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" /> : <Search size={15} />}
            {loading ? "Buscando..." : "Buscar"}
          </button>
          <button type="button" onClick={limpiar}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-sm rounded-xl transition-colors">
            Limpiar
          </button>
        </div>
      </form>

      {/* Resultados */}
      {resultados !== null && (
        <div className="space-y-3">
          <p className="text-sm text-slate-400">
            {resultados.length === 0 ? "No se encontraron jugadores con esos criterios." : `${resultados.length} jugador${resultados.length !== 1 ? "es" : ""} encontrado${resultados.length !== 1 ? "s" : ""}`}
          </p>

          {resultados.length === 0 ? (
            <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl">
              <Users size={36} className="text-slate-700 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">Prueba con criterios menos restrictivos</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {resultados.map((j) => {
                const avg = j.informes?.length ? promedioMetricas(j.informes) : null;
                return (
                  <Link key={j.id} href={`/jugadores/${j.id}`}
                    className="bg-slate-900 border border-slate-800 hover:border-green-800/60 rounded-2xl p-4 transition-all group hover:shadow-lg hover:shadow-green-900/10">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {j.nombre_completo.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate group-hover:text-green-300 transition-colors">{j.nombre_completo}</h3>
                        <p className="text-xs text-slate-500">{j.posicion_principal || "Sin posición"} · Pie {j.pie_dominante || "N/D"}</p>
                      </div>
                      {avg && (
                        <span className={`text-xl font-black flex-shrink-0 ${getColorValoracion(avg.total)}`}>{avg.total}</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
