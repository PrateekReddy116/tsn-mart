export default function HeroBanner() {
  return (
    <section className="bg-[#1a3c34] overflow-hidden">
      <div
        className="max-w-7xl mx-auto px-6 py-14 flex items-center justify-between gap-10"
        style={{
          background:
            "linear-gradient(135deg, #1a3c34 0%, #2a5c4c 60%, #1e4a3a 100%)",
        }}
      >
        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-green-400 text-sm font-semibold tracking-wide uppercase mb-3">
            Fresh &amp; Fast Delivery
          </p>
          <h1 className="text-white font-extrabold leading-tight mb-4"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
          >
            We bring the store
            <br />
            <span className="text-green-400">to your door</span>
          </h1>
          <p className="text-white/60 text-base mb-7 max-w-md leading-relaxed">
            Fresh groceries, daily essentials and more — delivered fast right to
            your doorstep.
          </p>
          <a
            href="#products"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 active:scale-95 text-white font-semibold px-6 py-3 rounded-full transition-all text-sm select-none"
          >
            Shop Now
            <span className="text-base">→</span>
          </a>
        </div>

        {/* Image */}
        <div className="hidden md:flex shrink-0 items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://png.pngtree.com/png-vector/20240126/ourmid/pngtree-grocery-bag-with-food-png-image_11496504.png"
            alt="Grocery Bag"
            width={260}
            height={260}
            className="object-contain drop-shadow-2xl"
            style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,.35))" }}
          />
        </div>
      </div>
    </section>
  );
}
