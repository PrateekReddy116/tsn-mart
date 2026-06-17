export default function HeroBanner({ profile }: { profile?: any }) {
  return (
    <section 
      className="relative rounded-[2rem] overflow-hidden flex flex-col md:flex-row items-center justify-between p-8 md:p-12 shadow-sm bg-gradient-to-br from-[#1a3c34] to-[#2a5c4c]"
    >
      <div className="flex-1 z-10 text-center md:text-left mb-6 md:mb-0">
        <p className="text-sm font-semibold text-green-200/80 mb-2 uppercase tracking-wide">
          Deal of the weekend
        </p>
        <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tight">
          Hello, {profile?.name ? profile.name.split(" ")[0] : "Guest"}
        </h1>
        <p className="text-green-50 mb-6 text-sm md:text-base">
          Get FREE delivery on every weekend.
        </p>
        <button 
          className="bg-white hover:bg-slate-50 text-[#1a3c34] font-semibold py-3 px-8 rounded-full transition-all active:scale-95 shadow-md"
        >
          Check menu
        </button>
      </div>
      
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-500 rounded-full -translate-y-1/2 translate-x-1/3 opacity-20 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-300 rounded-full translate-y-1/2 -translate-x-1/4 opacity-20 blur-3xl" />
    </section>
  );
}
