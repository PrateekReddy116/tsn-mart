"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#0d0e12" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8"
        style={{
          background: "#111318",
          border: "1px solid rgba(255,255,255,.07)",
          boxShadow: "0 24px 64px rgba(0,0,0,.5)",
        }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="TSN Mart" className="w-16 h-16 object-contain mx-auto mb-3" />
          <div className="text-white font-bold text-xl mb-1">TSN Mart</div>
          <p className="text-sm" style={{ color: "rgba(255,255,255,.35)" }}>
            Admin access only
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            autoComplete="email"
            className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-colors"
            style={{
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.08)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(255,255,255,.25)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,.08)")}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            autoComplete="current-password"
            className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-colors"
            style={{
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.08)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(255,255,255,.25)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,.08)")}
          />

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-semibold py-3 rounded-xl transition-all active:scale-[.98] disabled:opacity-50 mt-1"
            style={{ background: "#1a3c34" }}
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm transition-colors"
            style={{ color: "rgba(255,255,255,.25)" }}
          >
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
