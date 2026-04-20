import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return "—";
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

export function calcularEdad(fechaNacimiento: string | null): number | null {
  if (!fechaNacimiento) return null;
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
  return edad;
}

export function promedioMetricas(informes: { metrica_tecnica: number; metrica_fisica: number; metrica_tactica: number }[]) {
  if (!informes.length) return { tecnica: 0, fisica: 0, tactica: 0, total: 0 };
  const avg = (key: "metrica_tecnica" | "metrica_fisica" | "metrica_tactica") =>
    Math.round((informes.reduce((s, i) => s + i[key], 0) / informes.length) * 10) / 10;
  const tecnica = avg("metrica_tecnica");
  const fisica = avg("metrica_fisica");
  const tactica = avg("metrica_tactica");
  return { tecnica, fisica, tactica, total: Math.round(((tecnica + fisica + tactica) / 3) * 10) / 10 };
}

export function getColorValoracion(val: number): string {
  if (val >= 8) return "text-green-400";
  if (val >= 6) return "text-yellow-400";
  if (val >= 4) return "text-orange-400";
  return "text-red-400";
}
