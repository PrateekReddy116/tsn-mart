"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import LocationPickerModal from "@/components/LocationPickerModal";
import { MapPin, Map } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/signin");
        return;
      }
      setUser(user);

      const { data: profile } = await supabase
        .from("customer_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setName(profile.name || "");
        setPhone(profile.phone || "");
        setAddress(profile.address || "");
      } else {
        // Fallback to auth metadata if profile row doesn't exist
        setName(user.user_metadata?.full_name || "");
      }
      setLoading(false);
    }
    loadProfile();
  }, [router, supabase]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    
    // Upsert profile
    const { error } = await supabase
      .from("customer_profiles")
      .upsert({
        id: user.id,
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        updated_at: new Date().toISOString()
      });

    setSaving(false);
    if (error) {
      alert("Failed to save profile.");
    } else {
      alert("Profile updated successfully!");
    }
  }

  async function detectLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.display_name) {
            setAddress(data.display_name);
          } else {
            alert("Could not determine address from location.");
          }
        } catch (err) {
          alert("Failed to fetch address.");
        } finally {
          setDetectingLocation(false);
        }
      },
      () => {
        alert("Location access denied.");
        setDetectingLocation(false);
      }
    );
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">Loading...</div>;
  }

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <Header search="" onSearch={() => {}} onCartToggle={() => {}} user={user} profile={{ name }} />

        <main className="p-4 sm:p-6 lg:p-8 w-full max-w-2xl mx-auto flex-1">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-black text-[var(--brand)]">My Profile</h1>
            <button 
              onClick={handleSignOut}
              className="text-sm font-semibold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>

          <div className="bg-[var(--surface)] p-6 sm:p-8 rounded-3xl border border-[var(--border)] shadow-sm">
            <div className="mb-8 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[var(--brand)] flex items-center justify-center text-white text-2xl font-bold uppercase shadow-md shadow-[var(--brand)]/20">
                {name ? name.charAt(0) : user?.email?.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-lg text-[var(--text)]">{name || "Valued Customer"}</p>
                <p className="text-[var(--text3)] text-sm">{user?.email}</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[var(--text2)] mb-1.5 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)] outline-none focus:border-[var(--brand)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text2)] mb-1.5 uppercase tracking-wider">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="10 digit number"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)] outline-none focus:border-[var(--brand)] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="block text-xs font-bold text-[var(--text2)] mb-1.5 uppercase tracking-wider">Delivery Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)] outline-none focus:border-[var(--brand)] transition-colors resize-none"
                  placeholder="House No, Street, City"
                />
                <div className="flex items-center gap-4 mt-1">
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={detectingLocation}
                    className="text-xs font-semibold text-[var(--brand)] hover:opacity-80 transition-opacity disabled:opacity-50 flex items-center gap-1"
                  >
                    {detectingLocation ? <><MapPin size={14} className="animate-pulse" /> Detecting…</> : <><MapPin size={14} /> Detect Location</>}
                  </button>
                  <span className="text-[var(--text3)] text-xs">|</span>
                  <button
                    type="button"
                    onClick={() => setShowMapModal(true)}
                    className="text-xs font-semibold text-[var(--brand)] hover:opacity-80 transition-opacity flex items-center gap-1"
                  >
                    <Map size={14} /> Set on Map
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-8 bg-[var(--brand)] hover:bg-[var(--brand2)] text-white font-bold py-3.5 rounded-xl transition-all active:scale-[.98] shadow-md shadow-[var(--brand)]/20 mt-4"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </main>
      </div>

      {showMapModal && (
        <LocationPickerModal 
          onClose={() => setShowMapModal(false)}
          onConfirm={(addr) => {
            setAddress(addr);
            setShowMapModal(false);
          }}
        />
      )}
    </div>
  );
}
