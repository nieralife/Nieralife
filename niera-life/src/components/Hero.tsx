import { motion } from "motion/react";
import { Sparkles, Compass, ShieldCheck, Heart, ArrowRight, Award } from "lucide-react";
import { DIVISION_ASSETS } from "../assets";

interface HeroProps {
  onDivisionSelect: (division: string) => void;
  onOpenConsultation: () => void;
}

export default function Hero({ onDivisionSelect, onOpenConsultation }: HeroProps) {
  const divisions = [
    {
      id: "spices",
      index: "01. Culinary Heritage",
      title: "Ceylon Spices",
      description: "Authentic export-grade spices sourced directly from the heart of the island.",
      highlight: "ALBA Cinnamon & Pepper",
      bgClass: "bg-[#111111] hover:bg-[#141414]",
      image: DIVISION_ASSETS.spices
    },
    {
      id: "fashion",
      index: "02. Modern Aesthetic",
      title: "Contemporary Fashion",
      description: "Premium apparel and ethical handloom linens that blend tradition with modern chic.",
      highlight: "Indigo Dyed Resort-Wear",
      bgClass: "bg-[#151515] hover:bg-[#181818]",
      image: DIVISION_ASSETS.fashion
    },
    {
      id: "accessories",
      index: "03. Raw Elegance",
      title: "Handmade Accessories",
      description: "Organic accents sculpted from coconut shell, ocean reeds, and dynamic brass carvings.",
      highlight: "Artisan Reed Craft",
      bgClass: "bg-[#0D0D0D] hover:bg-[#121212]",
      image: DIVISION_ASSETS.accessories
    },
    {
      id: "drinks",
      index: "04. Vitality First",
      title: "Healthy & Energy Drinks",
      description: "Natural infusions tapped from King Coconut water designed for high-performance wellness.",
      highlight: "Tapped Ginger & Turmeric",
      bgClass: "bg-[#121212] hover:bg-[#161616]",
      image: DIVISION_ASSETS.drinks
    }
  ];

  return (
    <div className="relative bg-[#0A0A0A] border-b border-white/[0.08] text-white">
      
      {/* Dynamic ambient dark background glow elements */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-[130px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-amber-900/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Dual-Pane layout matching the template format */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:border-x lg:border-white/[0.08]">
          
          {/* LEFT COLUMN: Brand Statement & Meta Metrics */}
          <div className="lg:col-span-7 flex flex-col justify-between py-12 lg:py-16 lg:pr-12 border-b lg:border-b-0 lg:border-r border-white/[0.08] relative">
            
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-gold animate-pulse" />
                <span className="font-mono text-[10px] text-gold font-bold tracking-[0.35em] uppercase">
                  Elegance Redefined • ESTD 2026
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-2"
              >
                <h1 className="font-serif text-5xl sm:text-7xl xl:text-8xl font-light tracking-tight leading-[0.95] text-white">
                  Lifestyle <br />
                  <span className="text-stone-300 font-extralight">& Nature</span>
                </h1>
                <p className="font-sans text-xs text-stone-400 max-w-md mt-4 tracking-normal leading-relaxed">
                  NIERA LIFE Pvt Ltd is a premier Sri Lankan enterprise integrating regional farming cooperatives with high-end global marketplaces. Sourcing pure Ceylon quills, handloom weaving craft, natural accessories, and isotonic wellness beverages.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                <button
                  onClick={onOpenConsultation}
                  className="px-6 py-3 bg-gold text-black border border-gold font-serif text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:bg-[#A58039] hover:border-[#A58039] cursor-pointer"
                >
                  Request Consultation
                </button>
                <a
                  href="#catalog-section"
                  className="px-6 py-3 bg-transparent text-[#C5A059] border border-[#C5A059] font-serif text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:bg-gold/10 cursor-pointer"
                >
                  Explore Catalog
                </a>
              </motion.div>
            </div>

            {/* Meta statistics section at base of left column */}
            <div className="flex gap-12 mt-12 lg:mt-0 border-t border-white/[0.08] pt-6">
              <div>
                <p className="font-sans text-[10px] text-stone-400 uppercase tracking-widest leading-none mb-1">Established</p>
                <p className="font-serif text-sm font-semibold tracking-wider text-white">Colombo, SL</p>
              </div>
              <div>
                <p className="font-sans text-[10px] text-stone-400 uppercase tracking-widest leading-none mb-1">Excellence</p>
                <p className="font-serif text-sm font-semibold tracking-wider text-white">Pvt.Ltd</p>
              </div>
              <div>
                <p className="font-sans text-[10px] text-stone-400 uppercase tracking-widest leading-none mb-1">Certifications</p>
                <p className="font-serif text-sm font-semibold tracking-wider text-gold-light">Fair Trade</p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Custom Stacked Division Cards */}
          <div className="lg:col-span-5 flex flex-col divide-y divide-white/[0.08]">
            {divisions.map((div, idx) => (
              <motion.div
                key={div.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + idx * 0.1 }}
                className={`flex-1 p-8 flex flex-col justify-center transition-all duration-300 relative group cursor-pointer ${div.bgClass}`}
                onClick={() => onDivisionSelect(div.id)}
              >
                {/* Micro image thumbnail on hover */}
                <div className="absolute right-4 top-4 w-12 h-12 rounded overflow-hidden border border-white/10 opacity-40 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
                  <img
                    src={div.image}
                    alt={div.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-500"
                  />
                </div>

                <div className="font-mono text-[9px] text-[#C5A059] tracking-[0.2em] uppercase font-bold mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block"></span>
                  {div.index}
                </div>

                <h3 className="font-serif text-lg tracking-wider text-white group-hover:text-gold transition-colors flex items-center justify-between mb-1.5">
                  <span>{div.title}</span>
                  <ArrowRight className="w-4 h-4 text-stone-600 group-hover:text-gold group-hover:translate-x-1.5 transition-all duration-300" />
                </h3>

                <p className="font-sans text-xs text-stone-400 line-clamp-2 leading-relaxed max-w-sm">
                  {div.description}
                </p>

                <div className="mt-2.5 flex items-center gap-2">
                  <span className="text-[9px] font-mono tracking-widest text-[#DFBF82]/60 uppercase">
                    Grade: {div.highlight}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* Brand Core Trust Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y divide-stone-900 lg:divide-y-0 lg:divide-x divide-white/[0.08] border-b border-white/[0.08] lg:border-x lg:border-white/[0.08] bg-[#0A0A0A]">
          {[
            { icon: Compass, title: "100% Sri Lankan Rooted", desc: "Verifiable Territorial Origin" },
            { icon: ShieldCheck, title: "Direct Fair Trade", desc: "Direct Cooperative Partnerships" },
            { icon: Award, title: "Certified Organic Sourcing", desc: "Chemical-Free Island Sourcing" },
            { icon: Heart, title: "Artisan Soul Preserved", desc: "Traditional Weaves & Carvings" }
          ].map((badge, idx) => (
            <div key={idx} className="flex flex-col p-6 items-start gap-1">
              <badge.icon className="w-4 h-4 text-gold mb-1 stroke-[1.5]" />
              <h4 className="font-serif text-xs font-semibold text-stone-100 tracking-wider uppercase">{badge.title}</h4>
              <p className="font-mono text-[9px] text-stone-500 font-medium">{badge.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
