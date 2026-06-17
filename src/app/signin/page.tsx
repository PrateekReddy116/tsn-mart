"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    try {
      if (isSignUp) {
        // Sign Up
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: name.trim() },
          },
        });

        if (authError) throw authError;

        if (data.session) {
          // Create profile if session exists
          const { error: profileError } = await supabase
            .from("customer_profiles")
            .insert([{ id: data.user!.id, name: name.trim() }]);
            
          if (profileError && profileError.code !== '23505') {
             console.error("Profile creation error:", profileError);
          }
          
          alert("Account created! You are now signed in.");
          router.push("/");
          router.refresh();
        } else {
          alert("Account created! Please check your email to verify your account before signing in.");
          setIsSignUp(false);
          setEmail("");
          setPassword("");
        }
      } else {
        // Sign In
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (authError) throw authError;
        
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[var(--bg)] text-[var(--text)]">
      {/* Simple Header */}
      <header className="p-6">
        <Link href="/" className="inline-flex items-center gap-2 text-[var(--text2)] hover:text-[var(--text)] transition-colors">
          <ArrowLeft size={20} />
          <span className="font-medium text-sm">Back to store</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[var(--surface)] p-8 rounded-3xl border border-[var(--border)] shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black mb-2 text-[var(--brand)]">
              {isSignUp ? "Create an Account" : "Welcome Back"}
            </h1>
            <p className="text-[var(--text3)] text-sm">
              {isSignUp ? "Sign up to save items and track orders." : "Sign in to your account."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-[var(--text2)] mb-1.5 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)] outline-none focus:border-[var(--brand)] transition-colors"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[var(--text2)] mb-1.5 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)] outline-none focus:border-[var(--brand)] transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text2)] mb-1.5 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)] outline-none focus:border-[var(--brand)] transition-colors"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--brand)] hover:bg-[var(--brand2)] text-white font-bold py-3.5 rounded-xl transition-all active:scale-[.98] shadow-md shadow-[var(--brand)]/20 mt-2"
            >
              {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-[var(--text2)]">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
              className="font-bold text-[var(--brand)] hover:underline"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
