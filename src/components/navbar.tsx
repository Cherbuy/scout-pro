"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Users, FileText, LayoutDashboard, LogOut, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/jugadores", label: "Jugadores", icon: Users },
  { href: "/informes", label: "Informes", icon: FileText },
  { href: "/busqueda", label: "Búsqueda", icon: Search },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      {/* Top bar móvil */}
      <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-slate-900/95 backdrop-blur border-b border-slate-800 flex items-center px-4 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2 mr-auto">
          <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-slate-900 font-black text-xs">⚽</span>
          </div>
          <span className="font-bold text-white text-sm">ScoutPro</span>
        </Link>
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-slate-400 hover:text-white">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Menú móvil desplegable */}
      {menuOpen && (
        <div className="fixed inset-0 z-30 bg-slate-900/98 flex flex-col pt-14 lg:hidden">
          <nav className="flex-1 p-4 space-y-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  pathname.startsWith(href)
                    ? "bg-green-900/50 text-green-300 border border-green-800/50"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 w-full transition-all"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}

      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-60 bg-slate-900 border-r border-slate-800 z-40">
        <div className="p-5 border-b border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-slate-900 font-black text-base">⚽</span>
            </div>
            <div>
              <p className="font-bold text-white text-sm leading-tight">ScoutPro</p>
              <p className="text-xs text-slate-500">Scouting Platform</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                pathname.startsWith(href)
                  ? "bg-green-900/50 text-green-300 border border-green-800/50"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 w-full transition-all"
          >
            <LogOut size={17} />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
