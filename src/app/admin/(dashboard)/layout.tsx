import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Check if the user is an admin
  const { data: profile } = await supabase
    .from("customer_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    // Optionally log them out or just redirect them. 
    // Redirect to the regular home or a permission denied page.
    redirect("/?error=unauthorized");
  }

  return (
    <div className="min-h-screen text-[var(--text)] bg-[var(--bg)]">
      <AdminNav />
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
