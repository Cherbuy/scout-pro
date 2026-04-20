import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, FileText, Calendar } from "lucide-react";
import { promedioMetricas, getColorValoracion, formatDate } from "@/lib/utils";
import { Informe, Jugador } from "@/types";

export default async function InformesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: informes } = await supabase
    .from("informes")
    .select("*, jugadores!inner(nombre_completo, posicion_principal, user_id)")
    .eq("jugadores.user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-5 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Informes</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {informes?.length ?? 0} informe{informes?.length !== 1 ? "s" : ""} elaborados
          </p>
        </div>
        <Link href="/informes/nuevo" className="flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-400 text-slate-900 text-sm font-medium rounded-xl transition-all">
          <Plus size={15} />
          <span className="hidden sm:inline">Nuevo</span>
        </Link>
      </div>

      {!informes || informes.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
          <FileText size={40} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No hay informes aún</p>
          <p className="text-slate-500 text-sm mt-1">Crea tu primer informe de scouting</p>
          <Link href="/informes/nuevo" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-500 text-slate-900 text-sm font-medium rounded-xl hover:bg-green-400 transition-all">
            <Plus size={14} /> Crear informe
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {informes.map((inf: Informe & { jugadores: Jugador }) => {
            const avg = promedioMetricas([inf]).total;
            return (
              <Link
                key={inf.id}
                href={`/informes/${inf.id}`}
                className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-700 to-purple-900 flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate group-hover:text-green-300 transition-colors">
                    {inf.jugadores?.nombre_completo}
                  </p>
                  <p className="text-sm text-slate-500 truncate mt-0.5">
                    {inf.demarcacion_partido || inf.jugadores?.posicion_principal || "Sin demarcación"}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {inf.etiquetas?.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-xs text-green-500/70">{tag}</span>
                    ))}
                    {(inf.etiquetas?.length || 0) > 3 && (
                      <span className="text-xs text-slate-600">+{inf.etiquetas.length - 3}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`text-2xl font-black ${getColorValoracion(avg)}`}>{avg}</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar size={10} />
                    {formatDate(inf.created_at)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
