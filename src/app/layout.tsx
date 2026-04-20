import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScoutPro — Plataforma de Scouting",
  description: "Herramienta profesional de análisis y scouting de fútbol",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full" suppressHydrationWarning>
      <body className="min-h-full antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
