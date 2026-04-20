"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import PerfilGeografico from "@/components/perfil-geografico";
import { POSICIONES } from "@/types";

export default function EditarJugadorPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");

  const [nombre, setNombre] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [pieDominante, setPieDominante] = useState("");
  const [posicionPrincipal, setPosicionPrincipal] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");
  const [clubActual, setClubActual] = useState("");
  const [alturaCm, setAlturaCm] = useState("");
  const [demarcacionPrincipal, setDemarcacionPrincipal] = useState("");
  const [demarcacionSecundaria, setDemarcacionSecundaria] = useState("");
  const [zonasInfluencia, setZonasInfluencia] = useState<number[]>([]);
  const [tendenciasMovimiento, setTendenciasMovimiento] = useState("");

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("jugadores").select("*").eq("id", id).single();
      if (data) {
        setNombre(data.nombre_completo || "");
        setFechaNacimiento(data.fecha_nacimiento || "");
        setPieDominante(data.pie_dominante || "");
        setPosicionPrincipal(data.posicion_principal || "");
        setNacionalidad(data.nacionalidad || "");
        setClubActual(data.club_actual || "");
        setAlturaCm(data.altura_cm?.toString() || "");
        setDemarcacionPrincipal(data.demarcacion_principal || "");
        setDemarcacionSecundaria(data.demarcacion_secundaria || "");
        setZonasInfluencia(data.zonas_influencia || []);
        setTendenciasMovimiento(data.tendencias_movimiento || "");
      }
      setLoadingData(false);
    };
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) { setError("El nombre es obligatorio."); return; }
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("jugadores").update({
      nombre_completo: nombre.trim(),
      fecha_nacimiento: fechaNacimiento || null,
      pie_dominante: pieDominante || null,
      posicion_principal: posicionPrincipal || null,
      nacionalidad: nacionalidad || null,
      club_actual: clubActual || null,
      altura_cm: alturaCm ? Number(alturaCm) : null,
      demarcacion_principal: demarcacionPrincipal || null,
      demarcacion_secundaria: demarcacionSecundaria || null,
      zonas_influencia: zonasInfluencia.length > 0 ? zonasInfluencia : null,
      tendencias_movimiento: tendenciasMovimiento || null,
    }).eq("id", id);

    if (error) { setError(error.message); setLoading(false); return; }
    router.push(`/jugadores/${id}`);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar este jugador y todos sus informes?")) return;
    const supabase = createClient();
    await supabase.from("jugadores").delete().eq("id", id);
    router.push("/jugadores");
    router.refresh();
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5 py-2 max-w-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/jugadores/${id}`} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">Editar Jugador</h1>
            <p className="text-slate-400 text-sm">{nombre}</p>
          </div>
        </div>
        <button onClick={handleDelete} className="p-2 rounded-xl bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800/40 transition-all">
          <Trash2 size={16} />
        </button>
      </div>

      {error && <div className="px-4 py-3 bg-red-900/30 border border-red-700/50 rounded-xl text-red-400 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white">Datos personales</h2>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Nombre completo *</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-green-500 transition-colors" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Fecha de nacimiento</label>
              <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-green-500 transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Altura (cm)</label>
              <input type="number" value={alturaCm} onChange={(e) => setAlturaCm(e.target.value)} placeholder="180" min={140} max={220}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-green-500 transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Posición principal</label>
              <select value={posicionPrincipal} onChange={(e) => setPosicionPrincipal(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-green-500 transition-colors">
                <option value="">Seleccionar...</option>
                {POSICIONES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Pie dominante</label>
              <select value={pieDominante} onChange={(e) => setPieDominante(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-green-500 transition-colors">
                <option value="">Seleccionar...</option>
                <option value="Derecho">Derecho</option>
                <option value="Izquierdo">Izquierdo</option>
                <option value="Ambidiestro">Ambidiestro</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Nacionalidad</label>
              <input type="text" value={nacionalidad} onChange={(e) => setNacionalidad(e.target.value)} placeholder="Española"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-green-500 transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Club actual</label>
              <input type="text" value={clubActual} onChange={(e) => setClubActual(e.target.value)} placeholder="CD Ejemplo"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-green-500 transition-colors" />
            </div>
          </div>
        </div>

        <PerfilGeografico
          demarcacionPrincipal={demarcacionPrincipal} setDemarcacionPrincipal={setDemarcacionPrincipal}
          demarcacionSecundaria={demarcacionSecundaria} setDemarcacionSecundaria={setDemarcacionSecundaria}
          zonasInfluencia={zonasInfluencia} setZonasInfluencia={setZonasInfluencia}
          tendenciasMovimiento={tendenciasMovimiento} setTendenciasMovimiento={setTendenciasMovimiento}
        />

        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-400 disabled:bg-green-800 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-xl transition-all">
          {loading ? <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" /> : <Save size={16} />}
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
