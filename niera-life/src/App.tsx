import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Catalog from "./components/Catalog";
import InquiryForm from "./components/InquiryForm";
import AICurator from "./components/AICurator";
import AdminPanel from "./components/AdminPanel";
import { Product, Inquiry } from "./types";
import { Leaf, Award, Globe, Phone, Mail, MapPin, Eye, Lock } from "lucide-react";

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [currentTab, setCurrentTab] = useState<string>("all");
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  
  // Modals state
  const [selectedProductForInquiry, setSelectedProductForInquiry] = useState<Product | null>(null);
  const [isInquiryFormOpen, setIsInquiryFormOpen] = useState(false);
  const [isAICuratorOpen, setIsAICuratorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch products and inquiries on initial mount
  const handleFetchData = async () => {
    setIsLoading(true);
    try {
      const pRes = await fetch("/api/products");
      if (pRes.ok) {
        const pData = await pRes.json();
        setProducts(pData);
      }

      const iRes = await fetch("/api/inquiries");
      if (iRes.ok) {
        const iData = await iRes.json();
        setInquiries(iData);
      }
    } catch (err) {
      console.error("Error communicating with NIERA server:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  // API Callbacks: Submit new inquiry
  const handleAddInquiry = async (inquiryData: Omit<Inquiry, "id" | "status" | "createdAt">): Promise<boolean> => {
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiryData)
      });
      if (res.ok) {
        const newInq = await res.json();
        setInquiries(prev => [newInq, ...prev]);
        return true;
      }
    } catch (err) {
      console.error("Failed to post inquiry:", err);
    }
    return false;
  };

  // API Callbacks: Submit new product
  const handleAddProduct = async (productData: Partial<Product>): Promise<boolean> => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        const newProduct = await res.json();
        setProducts(prev => [newProduct, ...prev]);
        return true;
      }
    } catch (err) {
      console.error("Failed to post product to server db:", err);
    }
    return false;
  };

  // API Callbacks: Update existing product
  const handleUpdateProduct = async (id: string, updatedData: Partial<Product>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        const updatedProduct = await res.json();
        setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
        return true;
      }
    } catch (err) {
      console.error("Failed to update product:", err);
    }
    return false;
  };

  // API Callbacks: Delete product
  const handleDeleteProduct = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        return true;
      }
    } catch (err) {
      console.error("Failed to delete product representation:", err);
    }
    return false;
  };

  // API Callbacks: Update inquiry status (e.g. resolve or review)
  const handleUpdateInquiryStatus = async (id: string, status: Inquiry["status"]): Promise<boolean> => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updatedInq = await res.json();
        setInquiries(prev => prev.map(iq => iq.id === id ? updatedInq : iq));
        return true;
      }
    } catch (err) {
      console.error("Failed to update inquiry profile status:", err);
    }
    return false;
  };

  const handleOpenInquiryForm = (product: Product | null) => {
    setSelectedProductForInquiry(product);
    setIsInquiryFormOpen(true);
  };

  const pendingCount = inquiries.filter(iq => iq.status === "pending").length;

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] font-sans tracking-wide antialiased text-stone-100">
      
      {/* Corporate Sourcing Status Bar */}
      <div className="w-full bg-[#0D0D0D] border-b border-white/[0.04] text-stone-300 py-2.5 text-center text-[10px] font-mono uppercase tracking-[0.25em] font-medium px-4 flex items-center justify-center gap-4">
        <span>🍂 FREE TRADE EXPORTER LICENSE: <span className="text-gold">NIERA-944-LK</span></span>
        <span className="hidden sm:inline text-stone-800">|</span>
        <span className="hidden sm:inline">🌱 DIRECT COOPERATIVES SOURCING ACTIVE</span>
      </div>

      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setIsAdminMode(false);
        }}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        onOpenAICurator={() => setIsAICuratorOpen(true)}
        pendingInquiriesCount={pendingCount}
      />

      {/* Main Workspace Frame */}
      <main className="flex-grow">
        {isAdminMode ? (
          <AdminPanel
            products={products}
            inquiries={inquiries}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateInquiryStatus={handleUpdateInquiryStatus}
            onRefreshData={handleFetchData}
          />
        ) : (
          <div>
            {/* Front end layout homepage parallax */}
            {currentTab === "all" && (
              <Hero
                onDivisionSelect={(division) => setCurrentTab(division)}
                onOpenConsultation={() => handleOpenInquiryForm(null)}
              />
            )}

            {/* Catalog Grid based on active division selection */}
            <Catalog
              products={products}
              currentCategory={currentTab}
              onSelectCategory={(cat) => setCurrentTab(cat)}
              onInquire={handleOpenInquiryForm}
              isLoading={isLoading}
              onRefresh={handleFetchData}
            />
          </div>
        )}
      </main>

      {/* Floating elements & Slider Sidebars */}
      <InquiryForm
        product={selectedProductForInquiry}
        isOpen={isInquiryFormOpen}
        onClose={() => setIsInquiryFormOpen(false)}
        onSubmit={handleAddInquiry}
      />

      <AICurator
        isOpen={isAICuratorOpen}
        onClose={() => setIsAICuratorOpen(false)}
      />

      {/* High-End Slate Dark Theme Corporate Footer */}
      <footer className="bg-stone-950 text-stone-100 py-16 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-10">
          
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gold/15 text-gold flex items-center justify-center border border-gold/30">
                <Leaf className="w-3.5 h-3.5 stroke-[1.5]" />
              </div>
              <span className="font-serif text-base tracking-widest text-white uppercase">
                NIERA LIFE
              </span>
            </div>
            <p className="font-sans text-xs text-stone-400 leading-relaxed">
              NIERA LIFE Pvt Ltd is a premier Sri Lankan enterprise integrating regional farming cooperatives with high-end global marketplaces. Authenticating pure Ceylon quills, handloom weaving craft, natural coconut shell accessories, and revitalizing isotonic beverages.
            </p>
            <div className="flex items-center gap-1.5 pt-2">
              <Award className="w-4 h-4 text-[#DFBF82]" />
              <span className="font-mono text-[9px] uppercase tracking-wider text-gold font-bold">
                DIRECT FAIR TRADE EXPORT REGISTERED
              </span>
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <h4 className="font-serif text-[10.5px] uppercase font-bold tracking-widest text-[#C5A059] mb-2 pb-1 border-b border-white/5">
              Showrooms
            </h4>
            <div className="flex flex-col gap-1.5 text-xs text-stone-400 font-medium">
              <button onClick={() => { setCurrentTab("spices"); setIsAdminMode(false); }} className="hover:text-gold text-left transition-colors cursor-pointer">Ceylon Spices</button>
              <button onClick={() => { setCurrentTab("fashion"); setIsAdminMode(false); }} className="hover:text-gold text-left transition-colors cursor-pointer">Modern Fashion</button>
              <button onClick={() => { setCurrentTab("accessories"); setIsAdminMode(false); }} className="hover:text-gold text-left transition-colors cursor-pointer">Artisan Acc.</button>
              <button onClick={() => { setCurrentTab("drinks"); setIsAdminMode(false); }} className="hover:text-gold text-left transition-colors cursor-pointer">Energy Tonics</button>
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <h4 className="font-serif text-[10.5px] uppercase font-bold tracking-widest text-[#C5A059] mb-2 pb-1 border-b border-white/5">
              Internal Sourcing
            </h4>
            <div className="flex flex-col gap-1.5 text-xs text-stone-400 font-medium">
              <button onClick={() => setIsAdminMode(!isAdminMode)} className="hover:text-gold text-left transition-colors cursor-pointer flex items-center gap-1.5">
                {isAdminMode ? "View Showrooms" : "Staff Portal login"}
              </button>
              <button onClick={() => setIsAICuratorOpen(true)} className="hover:text-gold text-left transition-colors cursor-pointer">AI Concierge Assistant</button>
              <span className="text-stone-500 text-[11px] block">Cooperative Registry</span>
              <span className="text-stone-500 text-[11px] block">Traceability Logs</span>
            </div>
          </div>

          <div className="md:col-span-4 space-y-2">
            <h4 className="font-serif text-[10.5px] uppercase font-bold tracking-widest text-[#C5A059] mb-2 pb-1 border-b border-white/5">
              Corporate Headquarters
            </h4>
            <div className="space-y-3 font-sans text-xs text-stone-400">
              <p className="flex gap-2 leading-relaxed">
                <MapPin className="w-4 h-4 text-gold shrink-0" />
                <span>NIERA Office Plaza, Colombo-07, Western Province, Sri Lanka (Farms in Galle & Kandy)</span>
              </p>
              <p className="flex gap-2">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <span className="font-mono">exports@nieralife.com</span>
              </p>
              <p className="flex gap-2">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <span className="font-mono">+94 (11) 244-9440</span>
              </p>
            </div>
          </div>

        </div>

        {/* Outer bottom alignment line */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-white/[0.04] text-center flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <p className="font-sans text-[10px] text-stone-500 font-medium leading-none">
            © 2026 NIERA LIFE Pvt.Ltd. All human rights observed. Produced in partnership with Galle Agricultural Alliance.
          </p>
          <div className="flex gap-4 justify-center text-[10px] font-mono text-[#A58039]">
            <span>COOPERATIVE SAFE</span>
            <span>EXPORT LICENSE CR-944</span>
            <span>SECURED BY GEMINI API</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
