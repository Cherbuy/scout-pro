import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Edit, FileText, Calendar, MapPin } from "lucide-react";
import RadarMetricas from "@/components/radar-chart";
import CampoSVG from "@/components/campo-svg";
import { calcularEdad, formatDate, promedioMetricas, getColorValoracion } from "@/lib/utils";
import { Informe } from "@/types";

interface PageProps { params: Promise<{ id: string }> }

export default async function JugadorDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: jugador } = await supabase
    .from("jugadores")
    .select("*, informes(*)")
    .eq("id", id)
    .eq("user_id", user!.id)
    .single();

  if (!jugador) notFound();

  const informes: Informe[] = jugador.informes || [];
  const avg = informes.length ? promedioMetricas(informes) : null;

  return (
    <div className="space-y-5 py-2 max-w-3xl">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link href="/jugadores" className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all mt-0.5">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{jugador.nombre_completo}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {jugador.posicion_principal && (
              <span className="px-2 py-0.5 bg-green-900/50 text-green-300 text-xs rounded-full border border-green-700/40">
                {jugador.posicion_principal}
              </span>
            )}
            {jugador.pie_dominante && (
              <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded-full border border-slate-700">
                Pie {jugador.pie_dominante}
              </span>
            )}
            {jugador.club_actual && (
              <span className="text-slate-400 text-xs">{jugador.club_actual}</span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/informes/nuevo?jugador=${jugador.id}`}
            className="flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-400 text-slate-900 text-sm font-medium rounded-xl transition-all"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Informe</span>
          </Link>
          <Link
            href={`/jugadores/${jugador.id}/editar`}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-xl transition-all"
          >
            <Edit size={14} />
          </Link>
        </div>
      </div>

      {/* Stats rápidas */}
      {avg && (
        <div className="grid grid-cols-4 gap-3">
          {[
            { l: "General", v: avg.total, c: getColorValoracion(avg.total) },
            { l: "Técnica", v: avg.tecnica, c: "text-green-400" },
            { l: "Física", v: avg.fisica, c: "text-blue-400" },
            { l: "Táctica", v: avg.tactica, c: "text-purple-400" },
          ].map(({ l, v, c }) => (
            <div key={l} className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
              <p className={`text-2xl font-black ${c}`}>{v}</p>
              <p className="text-xs text-slate-500 mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Radar + datos personales */}
        <div className="space-y-4">
          {avg && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-white mb-2">Perfil de métricas</h3>
              <RadarMetricas tecnica={avg.tecnica} fisica={avg.fisica} tactica={avg.tactica} />
            </div>
          )}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
            <h3 className="text-sm font-semibold text-white mb-3">Datos personales</h3>
            {[
              { l: "Edad", v: jugador.fecha_nacimiento ? `${calcularEdad(jugador.fecha_nacimiento)} años (${formatDate(jugador.fecha_nacimiento)})` : "—" },
              { l: "Altura", v: jugador.altura_cm ? `${jugador.altura_cm} cm` : "—" },
              { l: "Nacionalidad", v: jugador.nacionalidad || "—" },
              { l: "Club", v: jugador.club_actual || "—" },
              { l: "Informes", v: `${informes.length}` },
            ].map(({ l, v }) => (
              <div key={l} className="flex items-center justify-between py-1.5 border-b border-slate-800 last:border-0">
                <span className="text-xs text-slate-500">{l}</span>
                <span className="text-sm text-white font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Perfil Geográfico */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Perfil Geográfico</h3>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Demarcación principal</span>
              <span className="text-sm text-white font-medium">{jugador.demarcacion_principal || "—"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Demarcación secundaria</span>
              <span className="text-sm text-white font-medium">{jugador.demarcacion_secundaria || "—"}</span>
            </div>
          </div>

          {jugador.zonas_influencia?.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 mb-2">Mapa de calor — zonas de influencia</p>
              <CampoSVG zonasSeleccionadas={jugador.zonas_influencia} readonly />
            </div>
          )}

          {jugador.tendencias_movimiento && (
            <div>
              <p className="text-xs text-slate-500 mb-1">Tendencias de movimiento</p>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/50 rounded-xl p-3">
                {jugador.tendencias_movimiento}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Historial de informes */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Historial de informes</h3>
          <Link href={`/informes/nuevo?jugador=${jugador.id}`} className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1">
            <Plus size={12} /> Nuevo informe
          </Link>
        </div>

        {informes.length === 0 ? (
          <div className="text-center py-8">
            <FileText size={28} className="text-slate-700 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">Aún no hay informes para este jugador</p>
          </div>
        ) : (
          <div className="space-y-2">
            {informes.map((inf: Informe) => {
              const avg = promedioMetricas([inf]).total;
              return (
                <Link key={inf.id} href={`/informes/${inf.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                    <FileText size={13} className="text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white group-hover:text-green-300 transition-colors">
                      {inf.demarcacion_partido || jugador.posicion_principal || "Sin posición"}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {inf.etiquetas?.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-xs text-green-500/70">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar size={11} />
                      {formatDate(inf.created_at)}
                    </span>
                    <span className={`text-lg font-black ${getColorValoracion(avg)}`}>{avg}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
