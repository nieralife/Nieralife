import { Leaf, ShoppingBag, Eye, Lock, MessageSquare, Menu, X, Award } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
  onOpenAICurator: () => void;
  pendingInquiriesCount: number;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  isAdminMode,
  setIsAdminMode,
  onOpenAICurator,
  pendingInquiriesCount
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: "all", label: "Overview" },
    { id: "spices", label: "Ceylon Spices" },
    { id: "fashion", label: "Contemporary Fashion" },
    { id: "accessories", label: "Handmade Accessories" },
    { id: "drinks", label: "Healthy Tonic Drinks" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A0A0A]/92 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Brand */}
          <div 
            onClick={() => { setCurrentTab("all"); setIsAdminMode(false); }} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center border border-gold/20 transition-transform group-hover:rotate-12 duration-300">
              <Leaf className="w-5 h-5 text-gold stroke-[1.5]" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-[0.2em] text-white block leading-tight">
                NIERA LIFE
              </span>
              <span className="font-mono text-[9px] tracking-[0.15em] text-gold-light/70 uppercase block -mt-0.5 font-semibold">
                PVT LTD • SRI LANKA
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsAdminMode(false);
                }}
                className={`font-sans text-xs font-semibold tracking-widest uppercase py-2 transition-all cursor-pointer ${
                  !isAdminMode && currentTab === item.id
                    ? "text-[#C5A059] border-b-2 border-[#C5A059]"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Helper Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* AI Assistant Button */}
            <button
              onClick={onOpenAICurator}
              className="flex items-center gap-2 px-4 py-2 rounded bg-gold/10 hover:bg-gold/20 border border-gold/30 text-gold-light text-xs font-bold font-sans tracking-widest uppercase transition-all hover:scale-[1.02] shadow-lg cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-gold" />
              AI Curator
            </button>

            {/* Back-end Admin Toggle */}
            <button
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-mono tracking-widest uppercase transition-all hover:scale-[1.02] border cursor-pointer ${
                isAdminMode
                  ? "bg-amber-600 border-amber-500 text-white"
                  : "bg-[#111111] hover:bg-[#161616] border-white/10 text-stone-200"
              }`}
            >
              {isAdminMode ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  View Showrooms
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-gold" />
                  Staff Portal
                  {pendingInquiriesCount > 0 && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
                    </span>
                  )}
                </>
              )}
            </button>
          </div>

          {/* Mobile Hamburguer */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={onOpenAICurator}
              className="p-2.5 rounded border border-gold/30 text-gold bg-[#111111]"
              title="AI Assistant"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded text-stone-400 hover:text-white hover:bg-stone-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/[0.08] bg-[#0A0A0A] px-4 py-6 space-y-4 shadow-xl">
          <div className="flex flex-col gap-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsAdminMode(false);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left font-sans text-xs font-semibold tracking-widest uppercase py-2.5 px-4 rounded transition-colors ${
                  !isAdminMode && currentTab === item.id
                    ? "bg-gold/20 text-white border-l-4 border-gold"
                    : "text-stone-300 hover:bg-stone-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="h-px bg-white/[0.08] my-4" />

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                onOpenAICurator();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 w-full py-3 rounded border border-gold/30 bg-gold/10 text-gold-light text-xs font-bold font-sans tracking-widest uppercase"
            >
              <MessageSquare className="w-4 h-4" />
              AI Curator Assistant
            </button>

            <button
              onClick={() => {
                setIsAdminMode(!isAdminMode);
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-center gap-2 w-full py-3 rounded text-xs font-semibold uppercase tracking-widest ${
                isAdminMode
                  ? "bg-amber-600 text-white"
                  : "bg-[#111111] text-stone-200 border border-white/10"
              }`}
            >
              {isAdminMode ? (
                <>
                  <Eye className="w-4 h-4" />
                  View Front End Website
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-gold" />
                  Staff Back End System
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
