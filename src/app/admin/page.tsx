import { createClient } from "@/lib/supabase/server";
import AdminProductsClient from "@/components/AdminProductsClient";
import { Product } from "@/lib/types";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id");

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <span className="text-5xl">⚠️</span>
        <h2 className="text-white font-semibold text-lg">Supabase not connected</h2>
        <p className="text-white/50 text-sm max-w-sm">
          Add your{" "}
          <code className="bg-white/10 px-1.5 py-0.5 rounded text-purple-300">
            NEXT_PUBLIC_SUPABASE_URL
          </code>{" "}
          and{" "}
          <code className="bg-white/10 px-1.5 py-0.5 rounded text-purple-300">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>{" "}
          to <code className="bg-white/10 px-1.5 py-0.5 rounded text-purple-300">.env.local</code>,
          then run the schema from <code className="bg-white/10 px-1.5 py-0.5 rounded text-purple-300">supabase/schema.sql</code>.
        </p>
        <p className="text-white/30 text-xs font-mono">{error.message}</p>
      </div>
    );
  }

  return <AdminProductsClient initialProducts={(data ?? []) as Product[]} />;
}
