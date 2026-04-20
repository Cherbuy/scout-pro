"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Save, Phone, Mail, Users, UserCircle } from "lucide-react";
import PerfilGeografico from "@/components/perfil-geografico";
import { POSICIONES } from "@/types";

export default function NuevoJugadorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [nombre, setNombre] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [pieDominante, setPieDominante] = useState("");
  const [posicionPrincipal, setPosicionPrincipal] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");
  const [clubActual, setClubActual] = useState("");
  const [alturaCm, setAlturaCm] = useState("");

  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [contactoFamiliar, setContactoFamiliar] = useState("");
  const [contactoManager, setContactoManager] = useState("");

  const [demarcacionPrincipal, setDemarcacionPrincipal] = useState("");
  const [demarcacionSecundaria, setDemarcacionSecundaria] = useState("");
  const [zonasInfluencia, setZonasInfluencia] = useState<number[]>([]);
  const [tendenciasMovimiento, setTendenciasMovimiento] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) { setError("El nombre es obligatorio."); return; }
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("jugadores").insert({
      user_id: user!.id,
      nombre_completo: nombre.trim(),
      fecha_nacimiento: fechaNacimiento || null,
      pie_dominante: pieDominante || null,
      posicion_principal: posicionPrincipal || null,
      nacionalidad: nacionalidad || null,
      club_actual: clubActual || null,
      altura_cm: alturaCm ? Number(alturaCm) : null,
      telefono: telefono || null,
      email: email || null,
      contacto_familiar: contactoFamiliar || null,
      contacto_manager: contactoManager || null,
      demarcacion_principal: demarcacionPrincipal || null,
      demarcacion_secundaria: demarcacionSecundaria || null,
      zonas_influencia: zonasInfluencia.length > 0 ? zonasInfluencia : null,
      tendencias_movimiento: tendenciasMovimiento || null,
    });

    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/jugadores");
    router.refresh();
  };

  return (
    <div className="space-y-5 py-2 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/jugadores" className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Nuevo Jugador</h1>
          <p className="text-slate-400 text-sm">Añade un jugador a tu base de datos</p>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-900/30 border border-red-700/50 rounded-xl text-red-400 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Datos básicos */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white">Datos personales</h2>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Nombre completo *</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Juan García Martínez"
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Fecha de nacimiento</label>
              <input
                type="date"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Altura (cm)</label>
              <input
                type="number"
                value={alturaCm}
                onChange={(e) => setAlturaCm(e.target.value)}
                placeholder="180"
                min={140}
                max={220}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Posición principal</label>
              <select
                value={posicionPrincipal}
                onChange={(e) => setPosicionPrincipal(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
              >
                <option value="">Seleccionar...</option>
                {POSICIONES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Pie dominante</label>
              <select
                value={pieDominante}
                onChange={(e) => setPieDominante(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
              >
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
              <input
                type="text"
                value={nacionalidad}
                onChange={(e) => setNacionalidad(e.target.value)}
                placeholder="Española"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Club actual</label>
              <input
                type="text"
                value={clubActual}
                onChange={(e) => setClubActual(e.target.value)}
                placeholder="CD Ejemplo"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Información de contacto */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-900/60 border border-orange-700/50 flex items-center justify-center">
              <Phone size={14} className="text-orange-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Información de contacto</h2>
              <p className="text-xs text-slate-500">Datos personales para contactar con el jugador o su entorno</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <Phone size={11} /> Teléfono
              </label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+34 600 000 000"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <Mail size={11} /> Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jugador@email.com"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <Users size={11} /> Contacto familiar
            </label>
            <input
              type="text"
              value={contactoFamiliar}
              onChange={(e) => setContactoFamiliar(e.target.value)}
              placeholder="Ej: Juan García (padre) — +34 611 111 111"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <UserCircle size={11} /> Representante / Manager
            </label>
            <input
              type="text"
              value={contactoManager}
              onChange={(e) => setContactoManager(e.target.value)}
              placeholder="Ej: Sport Agency — contacto@agency.com"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        {/* Perfil Geográfico */}
        <PerfilGeografico
          demarcacionPrincipal={demarcacionPrincipal}
          setDemarcacionPrincipal={setDemarcacionPrincipal}
          demarcacionSecundaria={demarcacionSecundaria}
          setDemarcacionSecundaria={setDemarcacionSecundaria}
          zonasInfluencia={zonasInfluencia}
          setZonasInfluencia={setZonasInfluencia}
          tendenciasMovimiento={tendenciasMovimiento}
          setTendenciasMovimiento={setTendenciasMovimiento}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-400 disabled:bg-green-800 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-xl transition-all"
        >
          {loading ? <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" /> : <Save size={16} />}
          {loading ? "Guardando..." : "Guardar jugador"}
        </button>
      </form>
    </div>
  );
}
