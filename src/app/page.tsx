import { createClient } from "@/lib/supabase/server";
import StorefrontClient from "@/components/StorefrontClient";
import { Product } from "@/lib/types";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id");

  // If Supabase isn't configured yet, show setup instructions
  if (error) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
          style={{ boxShadow: "0 4px 24px rgba(0,0,0,.08)" }}
        >
          <div className="text-5xl mb-4">🛍️</div>
          <h1 className="text-xl font-bold text-slate-800 mb-2">TSN Mart — Setup Required</h1>
          <p className="text-slate-500 text-sm mb-5 leading-relaxed">
            The database isn&apos;t connected yet. Follow these steps to get started:
          </p>
          <ol className="text-left text-sm text-slate-600 space-y-3 mb-5">
            <li className="flex gap-2">
              <span className="font-bold text-[#1a3c34] shrink-0">1.</span>
              Create a project at{" "}
              <a href="https://supabase.com" target="_blank" rel="noopener noreferrer"
                className="text-[#1a3c34] underline">supabase.com</a>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-[#1a3c34] shrink-0">2.</span>
              Run <code className="bg-slate-100 px-1.5 py-0.5 rounded">supabase/schema.sql</code> in the SQL editor
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-[#1a3c34] shrink-0">3.</span>
              Add your keys to <code className="bg-slate-100 px-1.5 py-0.5 rounded">.env.local</code>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-[#1a3c34] shrink-0">4.</span>
              Restart the dev server
            </li>
          </ol>
          <p className="text-xs text-slate-400 font-mono bg-slate-50 rounded-lg px-3 py-2">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  return <StorefrontClient initialProducts={(data ?? []) as Product[]} />;
}
