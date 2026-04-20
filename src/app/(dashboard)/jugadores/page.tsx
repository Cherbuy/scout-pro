import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Search, Users } from "lucide-react";
import { promedioMetricas, getColorValoracion } from "@/lib/utils";
import { Jugador, Informe, POSICIONES } from "@/types";

interface PageProps {
  searchParams: Promise<{ posicion?: string; busqueda?: string; pie?: string }>;
}

export default async function JugadoresPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let query = supabase
    .from("jugadores")
    .select("*, informes(metrica_tecnica, metrica_fisica, metrica_tactica)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  if (params.posicion) query = query.eq("posicion_principal", params.posicion);
  if (params.pie) query = query.eq("pie_dominante", params.pie);
  if (params.busqueda) query = query.ilike("nombre_completo", `%${params.busqueda}%`);

  const { data: jugadores } = await query;

  return (
    <div className="space-y-5 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Jugadores</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {jugadores?.length ?? 0} jugador{jugadores?.length !== 1 ? "es" : ""} en seguimiento
          </p>
        </div>
        <Link href="/jugadores/nuevo" className="flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-400 text-slate-900 text-sm font-medium rounded-xl transition-all">
          <Plus size={15} />
          <span className="hidden sm:inline">Nuevo</span>
        </Link>
      </div>

      {/* Filtros */}
      <form className="flex flex-wrap gap-2" method="get">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            name="busqueda"
            defaultValue={params.busqueda}
            placeholder="Buscar jugador..."
            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-green-500 transition-colors"
          />
        </div>
        <select
          name="posicion"
          defaultValue={params.posicion}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
        >
          <option value="">Todas las posiciones</option>
          {POSICIONES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select
          name="pie"
          defaultValue={params.pie}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
        >
          <option value="">Ambos pies</option>
          <option value="Derecho">Derecho</option>
          <option value="Izquierdo">Izquierdo</option>
          <option value="Ambidiestro">Ambidiestro</option>
        </select>
        <button type="submit" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-xl transition-colors">
          Filtrar
        </button>
        {(params.posicion || params.busqueda || params.pie) && (
          <Link href="/jugadores" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 text-sm rounded-xl transition-colors">
            Limpiar
          </Link>
        )}
      </form>

      {/* Lista */}
      {!jugadores || jugadores.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
          <Users size={40} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No hay jugadores</p>
          <p className="text-slate-500 text-sm mt-1">
            {params.busqueda || params.posicion ? "Prueba con otros filtros" : "Empieza añadiendo tu primer jugador"}
          </p>
          {!params.busqueda && !params.posicion && (
            <Link href="/jugadores/nuevo" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-500 text-slate-900 text-sm font-medium rounded-xl hover:bg-green-400 transition-all">
              <Plus size={14} /> Añadir jugador
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {jugadores.map((j: Jugador & { informes: Informe[] }) => {
            const avg = j.informes?.length ? promedioMetricas(j.informes) : null;
            return (
              <Link key={j.id} href={`/jugadores/${j.id}`} className="bg-slate-900 border border-slate-800 hover:border-green-800/60 rounded-2xl p-4 transition-all group hover:shadow-lg hover:shadow-green-900/10">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {j.nombre_completo.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate group-hover:text-green-300 transition-colors">{j.nombre_completo}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{j.posicion_principal || "Sin posición"}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {j.pie_dominante && (
                        <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 text-xs rounded border border-slate-700">
                          {j.pie_dominante[0]}
                        </span>
                      )}
                      {j.informes?.length > 0 && (
                        <span className="text-xs text-slate-500">{j.informes.length} informe{j.informes.length !== 1 ? "s" : ""}</span>
                      )}
                    </div>
                  </div>
                  {avg && (
                    <div className="text-right flex-shrink-0">
                      <span className={`text-xl font-black ${getColorValoracion(avg.total)}`}>{avg.total}</span>
                      <p className="text-xs text-slate-600">/ 10</p>
                    </div>
                  )}
                </div>

                {avg && (
                  <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-3 gap-1 text-center">
                    {[{ l: "TÉC", v: avg.tecnica, c: "text-green-400" }, { l: "FÍS", v: avg.fisica, c: "text-blue-400" }, { l: "TÁC", v: avg.tactica, c: "text-purple-400" }].map(({ l, v, c }) => (
                      <div key={l}>
                        <p className={`text-sm font-bold ${c}`}>{v}</p>
                        <p className="text-xs text-slate-600">{l}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
