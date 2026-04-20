import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Calendar, Trash2 } from "lucide-react";
import RadarMetricas from "@/components/radar-chart";
import CampoSVG from "@/components/campo-svg";
import MetricSlider from "@/components/metric-slider";
import { promedioMetricas, getColorValoracion, formatDate } from "@/lib/utils";
import ExportPDFButton from "./export-pdf-button";
import DeleteInformeButton from "./delete-button";

interface PageProps { params: Promise<{ id: string }> }

export default async function InformeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: informe } = await supabase
    .from("informes")
    .select("*, jugadores!inner(*, user_id)")
    .eq("id", id)
    .eq("jugadores.user_id", user!.id)
    .single();

  if (!informe) notFound();

  const avg = promedioMetricas([informe]);

  return (
    <div className="space-y-5 py-2 max-w-3xl" id="informe-pdf">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link href="/informes" className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all mt-0.5">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">Informe de Scouting</h1>
          <p className="text-slate-400 text-sm">
            <Link href={`/jugadores/${informe.jugadores.id}`} className="hover:text-green-400 transition-colors">
              {informe.jugadores.nombre_completo}
            </Link>
            {informe.rival && ` · vs ${informe.rival}`}
          </p>
        </div>
        <div className="flex gap-2">
          <ExportPDFButton informeId={id} jugadorNombre={informe.jugadores.nombre_completo} />
          <DeleteInformeButton informeId={id} jugadorId={informe.jugadores.id} />
        </div>
      </div>

      {/* Meta info */}
      <div className="flex flex-wrap gap-2">
        {informe.demarcacion_partido && (
          <span className="px-2.5 py-1 bg-green-900/40 text-green-300 text-xs rounded-full border border-green-800/40">
            {informe.demarcacion_partido}
          </span>
        )}
        {informe.fecha_partido && (
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar size={11} /> {formatDate(informe.fecha_partido)}
          </span>
        )}
        {informe.partido_id && (
          <span className="text-xs text-slate-500">{informe.partido_id}</span>
        )}
      </div>

      {/* Score general */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-5">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className={`text-4xl font-black ${getColorValoracion(avg.total)}`}>{avg.total}</p>
            <p className="text-xs text-slate-500 mt-1">General</p>
          </div>
          {[
            { l: "Técnica", v: avg.tecnica, c: "text-green-400" },
            { l: "Física", v: avg.fisica, c: "text-blue-400" },
            { l: "Táctica", v: avg.tactica, c: "text-purple-400" },
          ].map(({ l, v, c }) => (
            <div key={l}>
              <p className={`text-3xl font-black ${c}`}>{v}</p>
              <p className="text-xs text-slate-500 mt-1">{l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Radar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Perfil de métricas</h3>
          <RadarMetricas tecnica={avg.tecnica} fisica={avg.fisica} tactica={avg.tactica} />
          <div className="space-y-3 mt-4">
            <MetricSlider label="Técnica" value={informe.metrica_tecnica} onChange={() => {}} color="green" readonly />
            <MetricSlider label="Física" value={informe.metrica_fisica} onChange={() => {}} color="blue" readonly />
            <MetricSlider label="Táctica" value={informe.metrica_tactica} onChange={() => {}} color="purple" readonly />
          </div>
        </div>

        {/* Zona de acción */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Zona de acción en el partido</h3>
          <CampoSVG zonasSeleccionadas={informe.zona_accion || []} readonly />
        </div>
      </div>

      {/* Etiquetas */}
      {informe.etiquetas?.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Perfil de juego</h3>
          <div className="flex flex-wrap gap-2">
            {informe.etiquetas.map((tag: string) => (
              <span key={tag} className="px-3 py-1 bg-green-900/40 text-green-300 text-sm rounded-full border border-green-800/40">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tendencias de movimiento */}
      {informe.tendencias_movimiento && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-white mb-2">Tendencias de movimiento</h3>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{informe.tendencias_movimiento}</p>
        </div>
      )}

      {/* Conclusiones */}
      {informe.conclusiones && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-white mb-2">Conclusiones del análisis</h3>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{informe.conclusiones}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-800">
        <span>ScoutPro · Informe generado el {formatDate(informe.created_at)}</span>
        <span>ID: {informe.id.slice(0, 8)}...</span>
      </div>
    </div>
  );
}
