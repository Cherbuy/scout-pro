import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Users, FileText, TrendingUp, Plus, Star } from "lucide-react";
import { promedioMetricas, getColorValoracion } from "@/lib/utils";
import { Jugador, Informe } from "@/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: jugadores } = await supabase
    .from("jugadores")
    .select("*, informes(metrica_tecnica, metrica_fisica, metrica_tactica)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const { count: totalJugadores } = await supabase
    .from("jugadores")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id);

  const { count: totalInformes } = await supabase
    .from("informes")
    .select("*, jugadores!inner(user_id)", { count: "exact", head: true })
    .eq("jugadores.user_id", user!.id);

  const { data: ultimosInformes } = await supabase
    .from("informes")
    .select("*, jugadores!inner(nombre_completo, posicion_principal, user_id)")
    .eq("jugadores.user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">Resumen de tu actividad de scouting</p>
        </div>
        <div className="flex gap-2">
          <Link href="/jugadores/nuevo" className="flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-400 text-slate-900 text-sm font-medium rounded-xl transition-all">
            <Plus size={15} />
            <span className="hidden sm:inline">Nuevo jugador</span>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Jugadores</p>
            <div className="w-8 h-8 rounded-lg bg-blue-900/50 border border-blue-800/50 flex items-center justify-center">
              <Users size={14} className="text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{totalJugadores ?? 0}</p>
          <p className="text-xs text-slate-500 mt-1">en seguimiento</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Informes</p>
            <div className="w-8 h-8 rounded-lg bg-purple-900/50 border border-purple-800/50 flex items-center justify-center">
              <FileText size={14} className="text-purple-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{totalInformes ?? 0}</p>
          <p className="text-xs text-slate-500 mt-1">elaborados</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Promedio valoración</p>
            <div className="w-8 h-8 rounded-lg bg-green-900/50 border border-green-800/50 flex items-center justify-center">
              <TrendingUp size={14} className="text-green-400" />
            </div>
          </div>
          {jugadores && jugadores.length > 0 ? (() => {
            const allInformes = jugadores.flatMap((j: Jugador & { informes: Informe[] }) => j.informes || []);
            const avg = allInformes.length > 0 ? promedioMetricas(allInformes).total : 0;
            return (
              <>
                <p className={`text-3xl font-bold ${getColorValoracion(avg)}`}>{avg || "—"}</p>
                <p className="text-xs text-slate-500 mt-1">sobre 10 puntos</p>
              </>
            );
          })() : (
            <>
              <p className="text-3xl font-bold text-slate-600">—</p>
              <p className="text-xs text-slate-500 mt-1">sin datos aún</p>
            </>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Últimos jugadores */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Últimos jugadores</h2>
            <Link href="/jugadores" className="text-xs text-green-400 hover:text-green-300">Ver todos →</Link>
          </div>
          {!jugadores || jugadores.length === 0 ? (
            <div className="text-center py-8">
              <Users size={28} className="text-slate-700 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No hay jugadores aún.</p>
              <Link href="/jugadores/nuevo" className="text-green-400 text-xs hover:text-green-300 mt-1 inline-block">
                Añade el primero →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {jugadores.map((j: Jugador & { informes: Informe[] }) => {
                const avg = j.informes?.length ? promedioMetricas(j.informes).total : null;
                return (
                  <Link key={j.id} href={`/jugadores/${j.id}`} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800 transition-colors group">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">
                        {j.nombre_completo.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate group-hover:text-green-300 transition-colors">{j.nombre_completo}</p>
                      <p className="text-xs text-slate-500 truncate">{j.posicion_principal || "Sin posición"}</p>
                    </div>
                    {avg !== null && (
                      <span className={`text-sm font-bold flex-shrink-0 ${getColorValoracion(avg)}`}>{avg}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Últimos informes */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Últimos informes</h2>
            <Link href="/informes" className="text-xs text-green-400 hover:text-green-300">Ver todos →</Link>
          </div>
          {!ultimosInformes || ultimosInformes.length === 0 ? (
            <div className="text-center py-8">
              <FileText size={28} className="text-slate-700 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No hay informes aún.</p>
              <Link href="/informes/nuevo" className="text-green-400 text-xs hover:text-green-300 mt-1 inline-block">
                Crea el primero →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {ultimosInformes.map((inf: Informe & { jugadores: Jugador }) => {
                const avg = promedioMetricas([inf]).total;
                return (
                  <Link key={inf.id} href={`/informes/${inf.id}`} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800 transition-colors group">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center flex-shrink-0">
                      <Star size={14} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate group-hover:text-purple-300 transition-colors">
                        {inf.jugadores?.nombre_completo}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {inf.demarcacion_partido || inf.jugadores?.posicion_principal || "—"}
                        {inf.etiquetas?.slice(0, 2).map((t: string) => ` · ${t}`)}
                      </p>
                    </div>
                    <span className={`text-sm font-bold flex-shrink-0 ${getColorValoracion(avg)}`}>{avg}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
