"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Trash2 } from "lucide-react";

interface DeleteInformeButtonProps {
  informeId: string;
  jugadorId: string;
}

export default function DeleteInformeButton({ informeId, jugadorId }: DeleteInformeButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este informe? Esta acción no se puede deshacer.")) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from("informes").delete().eq("id", informeId);
    router.push(`/jugadores/${jugadorId}`);
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      title="Eliminar informe"
      className="p-2 rounded-xl bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800/40 transition-all"
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-red-400/20 border-t-red-400 rounded-full animate-spin block" />
      ) : (
        <Trash2 size={15} />
      )}
    </button>
  );
}
