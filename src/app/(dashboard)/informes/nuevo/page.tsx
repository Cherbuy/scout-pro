"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import CampoSVG from "@/components/campo-svg";
import TagsInput from "@/components/tags-input";
import MetricSlider from "@/components/metric-slider";
import { Jugador, POSICIONES } from "@/types";

export default function NuevoInformePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jugadorPreseleccionado = searchParams.get("jugador");

  const [jugadores, setJugadores] = useState<Pick<Jugador, "id" | "nombre_completo" | "posicion_principal">[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [jugadorId, setJugadorId] = useState(jugadorPreseleccionado || "");
  const [partidoId, setPartidoId] = useState("");
  const [fechaPartido, setFechaPartido] = useState("");
  const [rival, setRival] = useState("");
  const [demarcacion, setDemarcacion] = useState("");
  const [zonaAccion, setZonaAccion] = useState<number[]>([]);
  const [tendencias, setTendencias] = useState("");
  const [etiquetas, setEtiquetas] = useState<string[]>([]);
  const [metricaTecnica, setMetricaTecnica] = useState(7);
  const [metricaFisica, setMetricaFisica] = useState(7);
  const [metricaTactica, setMetricaTactica] = useState(7);
  const [conclusiones, setConclusiones] = useState("");

  useEffect(() => {
    const loadJugadores = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase
        .from("jugadores")
        .select("id, nombre_completo, posicion_principal")
        .eq("user_id", user!.id)
        .order("nombre_completo");
      setJugadores(data || []);
    };
    loadJugadores();
  }, []);

  const toggleZona = (zona: number) => {
    setZonaAccion((prev) =>
      prev.includes(zona) ? prev.filter((z) => z !== zona) : [...prev, zona]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jugadorId) { setError("Selecciona un jugador."); return; }
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("informes").insert({
      jugador_id: jugadorId,
      partido_id: partidoId || null,
      fecha_partido: fechaPartido || null,
      rival: rival || null,
      demarcacion_partido: demarcacion || null,
      zona_accion: zonaAccion,
      tendencias_movimiento: tendencias || null,
      etiquetas: etiquetas,
      metrica_tecnica: metricaTecnica,
      metrica_fisica: metricaFisica,
      metrica_tactica: metricaTactica,
      conclusiones: conclusiones || null,
    });

    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/informes");
    router.refresh();
  };

  return (
    <div className="space-y-5 py-2 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/informes" className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Nuevo Informe</h1>
          <p className="text-slate-400 text-sm">Registra el análisis de un jugador</p>
        </div>
      </div>

      {error && <div className="px-4 py-3 bg-red-900/30 border border-red-700/50 rounded-xl text-red-400 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Jugador y partido */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white">Contexto del partido</h2>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Jugador *</label>
            <select
              value={jugadorId}
              onChange={(e) => setJugadorId(e.target.value)}
              required
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
            >
              <option value="">Seleccionar jugador...</option>
              {jugadores.map((j) => (
                <option key={j.id} value={j.id}>{j.nombre_completo} — {j.posicion_principal || "Sin posición"}</option>
              ))}
            </select>
            {jugadores.length === 0 && (
              <p className="text-xs text-amber-500">
                Primero <Link href="/jugadores/nuevo" className="underline hover:text-amber-400">añade un jugador</Link>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Fecha del partido</label>
              <input type="date" value={fechaPartido} onChange={(e) => setFechaPartido(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-green-500 transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Rival</label>
              <input type="text" value={rival} onChange={(e) => setRival(e.target.value)} placeholder="CD Ejemplo"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-green-500 transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Demarcación en este partido</label>
              <select value={demarcacion} onChange={(e) => setDemarcacion(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-green-500 transition-colors">
                <option value="">Seleccionar...</option>
                {POSICIONES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">ID partido (opcional)</label>
              <input type="text" value={partidoId} onChange={(e) => setPartidoId(e.target.value)} placeholder="J15 Liga 24/25"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-green-500 transition-colors" />
            </div>
          </div>
        </div>

        {/* Mapa de zonas */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-white">Zona de acción en el partido</h2>
            <p className="text-xs text-slate-500 mt-0.5">Selecciona las zonas donde actuó este partido específico</p>
          </div>
          <CampoSVG zonasSeleccionadas={zonaAccion} onZonaClick={toggleZona} />
        </div>

        {/* Tendencias de movimiento */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h2 className="text-sm font-semibold text-white">Tendencias de movimiento</h2>
          <textarea
            value={tendencias}
            onChange={(e) => setTendencias(e.target.value)}
            rows={3}
            placeholder="Describe el comportamiento del jugador sin balón, sus desmarques, movimientos específicos observados..."
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-green-500 transition-colors resize-none"
          />
        </div>

        {/* Etiquetas */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-white">Etiquetas de perfil</h2>
            <p className="text-xs text-slate-500 mt-0.5">Añade tags descriptivos del estilo de juego</p>
          </div>
          <TagsInput value={etiquetas} onChange={setEtiquetas} />
        </div>

        {/* Métricas */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
          <h2 className="text-sm font-semibold text-white">Valoraciones</h2>
          <MetricSlider label="Técnica" value={metricaTecnica} onChange={setMetricaTecnica} color="green" />
          <MetricSlider label="Física" value={metricaFisica} onChange={setMetricaFisica} color="blue" />
          <MetricSlider label="Táctica" value={metricaTactica} onChange={setMetricaTactica} color="purple" />
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <span className="text-sm text-slate-400">Puntuación media</span>
            <span className={`text-2xl font-black ${getColorValoracion(Math.round(((metricaTecnica + metricaFisica + metricaTactica) / 3) * 10) / 10)}`}>
              {Math.round(((metricaTecnica + metricaFisica + metricaTactica) / 3) * 10) / 10}
            </span>
          </div>
        </div>

        {/* Conclusiones */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h2 className="text-sm font-semibold text-white">Conclusiones del análisis</h2>
          <textarea
            value={conclusiones}
            onChange={(e) => setConclusiones(e.target.value)}
            rows={4}
            placeholder="Resumen del análisis, puntos fuertes, áreas de mejora, recomendación..."
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-green-500 transition-colors resize-none"
          />
        </div>

        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-400 disabled:bg-green-800 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-xl transition-all">
          {loading ? <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" /> : <Save size={16} />}
          {loading ? "Guardando..." : "Guardar informe"}
        </button>
      </form>
    </div>
  );
}

function getColorValoracion(val: number): string {
  if (val >= 8) return "text-green-400";
  if (val >= 6) return "text-yellow-400";
  if (val >= 4) return "text-orange-400";
  return "text-red-400";
}
