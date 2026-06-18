"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lock, Mail, KeyRound } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      // Check role
      if (data.user) {
        const { data: profile } = await supabase
          .from("customer_profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (profile?.role === "admin") {
          router.push("/admin");
          router.refresh();
        } else {
          await supabase.auth.signOut();
          setError("Access Denied: You are not an admin.");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 max-w-sm w-full shadow-2xl">
        <div className="w-12 h-12 bg-[var(--surface2)] rounded-full flex items-center justify-center mb-6 mx-auto text-[var(--text)]">
          <Lock size={24} />
        </div>
        <h1 className="text-xl font-bold text-center text-[var(--text)] mb-2">Admin Login</h1>
        <p className="text-sm text-center text-[var(--text3)] mb-8">Enter the master password to access the dashboard</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text3)] pointer-events-none">
              <Mail size={18} />
            </div>
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)] outline-none focus:border-[var(--brand)] text-[var(--text)] transition-colors"
            />
          </div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text3)] pointer-events-none">
              <KeyRound size={18} />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)] outline-none focus:border-[var(--brand)] text-[var(--text)] transition-colors"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password || !email}
            className="w-full bg-[var(--brand)] hover:bg-[var(--brand2)] text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 active:scale-[.98]"
          >
            {loading ? "Verifying..." : "Access Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
