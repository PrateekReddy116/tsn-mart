export default function HeroBanner() {
  return (
    <section className="overflow-hidden relative" style={{ background: "var(--brand)" }}>
      {/* subtle texture circles */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "rgba(255,255,255,.04)" }} />
      <div className="absolute bottom-0 left-1/4 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: "rgba(0,0,0,.08)" }} />

      <div className="max-w-7xl mx-auto px-5 py-10 relative flex items-center justify-between gap-6">
        <div className="flex-1 min-w-0">
          <h1
            className="text-white font-black leading-tight mb-3"
            style={{ fontSize: "clamp(1.6rem, 4.5vw, 2.75rem)" }}
          >
            Fresh groceries
            <br />
            <span style={{ color: "#86efac" }}>at your doorstep.</span>
          </h1>
          <p className="mb-6 text-sm leading-relaxed"
            style={{ color: "rgba(255,255,255,.6)", maxWidth: "22rem" }}
          >
            Daily essentials, fresh produce and household staples — all under one roof, delivered fast.
          </p>
          <a
            href="#products"
            className="inline-flex items-center gap-2 font-bold px-5 py-2.5 rounded-xl text-sm transition-all active:scale-95 select-none"
            style={{ background: "rgba(255,255,255,.15)", color: "white", border: "1px solid rgba(255,255,255,.25)" }}
          >
            Shop Now →
          </a>
        </div>

        <div className="hidden md:block shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://png.pngtree.com/png-vector/20240126/ourmid/pngtree-grocery-bag-with-food-png-image_11496504.png"
            alt="Groceries"
            className="w-48 h-48 object-contain"
            style={{ filter: "drop-shadow(0 12px 28px rgba(0,0,0,.35))" }}
          />
        </div>
      </div>
    </section>
  );
}
