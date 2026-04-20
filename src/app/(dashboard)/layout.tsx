import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/navbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="lg:pl-60 pt-14 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-6 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
