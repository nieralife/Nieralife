import React, { useState, useEffect } from "react";
import { Product, Inquiry } from "../types";
import { 
  FileText, Plus, Edit2, Trash2, Mail, Check, AlertCircle, Sparkles, 
  Settings, ShoppingCart, TrendingUp, Info, HelpCircle, Eye, Archive
} from "lucide-react";

interface AdminPanelProps {
  products: Product[];
  inquiries: Inquiry[];
  onAddProduct: (productData: Partial<Product>) => Promise<boolean>;
  onUpdateProduct: (id: string, updatedData: Partial<Product>) => Promise<boolean>;
  onDeleteProduct: (id: string) => Promise<boolean>;
  onUpdateInquiryStatus: (id: string, status: Inquiry["status"]) => Promise<boolean>;
  onRefreshData: () => void;
}

export default function AdminPanel({
  products,
  inquiries,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateInquiryStatus,
  onRefreshData
}: AdminPanelProps) {
  // Tabs: 'inquiries' | 'products' | 'configurator'
  const [activeTab, setActiveTab] = useState<'inquiries' | 'products' | 'configurator'>('inquiries');
  
  // Product Creation state
  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState<"spices" | "fashion" | "accessories" | "drinks">("spices");
  const [prodDescription, setProdDescription] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodStock, setProdStock] = useState("50");
  const [prodOrigin, setProdOrigin] = useState("Kandy Highlands, Sri Lanka");
  const [prodGradeOrMaterial, setProdGradeOrMaterial] = useState("Organic Grade-A");
  
  // Edit Mode state
  const [editingId, setEditingId] = useState<string | null>(null);

  // AI copywriter generator status
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiKeywords, setAiKeywords] = useState("");

  // Stats calculate
  const totalInquiries = inquiries.length;
  const pendingInquiries = inquiries.filter(iq => iq.status === 'pending').length;
  const totalProducts = products.length;

  const handleGenerateAICopy = async () => {
    if (!prodName) {
      alert("Please provide a product name first before asking AI to draft.");
      return;
    }
    setIsGeneratingAI(true);
    try {
      const response = await fetch("/api/admin/generate-product-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: prodName,
          category: prodCategory,
          keyHighlights: aiKeywords
        })
      });

      if (!response.ok) throw new Error("AI details failed to write.");

      const data = await response.json();
      if (data.description) {
        setProdDescription(data.description);
      }
    } catch (err) {
      console.error(err);
      alert("Could not process AI write-up. Is your server connection active?");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleCreateOrUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice) {
      alert("Name and Price are mandatory parameters.");
      return;
    }

    const payload: Partial<Product> = {
      name: prodName,
      category: prodCategory,
      description: prodDescription,
      price: Number(prodPrice),
      stock: Number(prodStock),
      attributes: {
        origin: prodOrigin,
        grade: prodCategory === "spices" || prodCategory === "drinks" ? prodGradeOrMaterial : undefined,
        material: prodCategory === "fashion" || prodCategory === "accessories" ? prodGradeOrMaterial : undefined
      }
    };

    let success = false;
    if (editingId) {
      success = await onUpdateProduct(editingId, payload);
    } else {
      success = await onAddProduct(payload);
    }

    if (success) {
      // Clear forms
      setProdName("");
      setProdDescription("");
      setProdPrice("");
      setProdStock("50");
      setProdOrigin("Kandy Highlands, Sri Lanka");
      setProdGradeOrMaterial("Organic Grade-A");
      setAiKeywords("");
      setEditingId(null);
    }
  };

  const handleStartEdit = (p: Product) => {
    setEditingId(p.id);
    setProdName(p.name);
    setProdCategory(p.category);
    setProdDescription(p.description);
    setProdPrice(p.price.toString());
    setProdStock(p.stock.toString());
    setProdOrigin(p.attributes.origin || "");
    setProdGradeOrMaterial(p.attributes.grade || p.attributes.material || "");
    setActiveTab('configurator');
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen py-10 border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Frame Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111111] p-6 rounded border border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#0A0A0A] border border-white/10 rounded flex items-center justify-center text-gold">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="font-serif text-xl font-semibold text-white tracking-wide">
                  NIERA LIFE • Operation Control Hub
                </h2>
                <span className="bg-gold/10 text-gold text-[9px] font-bold font-mono px-2 py-0.5 rounded border border-gold/10 uppercase tracking-widest">
                  Live DB Active
                </span>
              </div>
              <p className="font-sans text-xs text-stone-400 mt-1.5 leading-relaxed">
                Management of client direct trade specifications, active container sourcing pipelines, and instant Gemini copywriting assistants.
              </p>
            </div>
          </div>
          
          <button
            onClick={onRefreshData}
            className="px-4 py-2 border border-white/10 hover:border-gold/40 bg-[#0A0A0A] hover:bg-white/5 text-[#DFBF82] text-xs font-serif font-bold uppercase tracking-wider rounded transition-all cursor-pointer"
          >
            Refresh Hub Data
          </button>
        </div>

        {/* Dashboard Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Card 1: Pending Inquiries */}
          <div className="bg-[#111]/90 border border-white/[0.08] rounded p-6 shadow-sm flex items-center justify-between">
            <div>
              <span className="block font-serif text-[10px] text-[#C5A059] font-bold uppercase tracking-widest">
                Pending Sourcing Specifications
              </span>
              <span className="block font-mono text-3xl font-extrabold text-white mt-2">
                {pendingInquiries}
              </span>
              <p className="font-sans text-[11px] text-stone-400 mt-1">
                Active global wholesale requests requiring review
              </p>
            </div>
            <div className="w-11 h-11 rounded bg-gold/10 text-gold border border-gold/20 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Total Items */}
          <div className="bg-[#111]/90 border border-white/[0.08] rounded p-6 shadow-sm flex items-center justify-between">
            <div>
              <span className="block font-serif text-[10px] text-[#C5A059] font-bold uppercase tracking-widest">
                Total Registered Goods
              </span>
              <span className="block font-mono text-3xl font-extrabold text-white mt-2">
                {totalProducts}
              </span>
              <p className="font-sans text-[11px] text-stone-400 mt-1">
                Active spices, fashion clothing, and wellness inputs
              </p>
            </div>
            <div className="w-11 h-11 rounded bg-gold/10 text-gold border border-gold/20 flex items-center justify-center">
              <Archive className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: Database health */}
          <div className="bg-[#111]/90 border border-white/[0.08] rounded p-6 shadow-sm flex items-center justify-between">
            <div>
              <span className="block font-serif text-[10px] text-[#C5A059] font-bold uppercase tracking-widest">
                Operational Port Integrity
              </span>
              <div className="flex items-center gap-2 mt-3">
                <span className="h-2.5 w-2.5 rounded-full bg-gold animate-pulse block" />
                <span className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                  OPTIMAL (PORT 3000)
                </span>
              </div>
              <p className="font-sans text-[11px] text-stone-400 mt-1">
                Direct-Trade secure connections working normally
              </p>
            </div>
            <div className="w-11 h-11 rounded bg-gold/10 text-gold border border-gold/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* Workspace controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left panel switcher links */}
          <div className="lg:col-span-3 space-y-2">
            <h3 className="font-serif text-[10px] uppercase font-bold tracking-widest text-[#C5A059] mb-4 px-1">
              Hub Departments
            </h3>
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full text-left py-3.5 px-4 rounded text-xs font-bold font-serif uppercase tracking-widest flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'inquiries'
                  ? "bg-gold text-black shadow-lg"
                  : "bg-[#111] text-stone-400 hover:bg-white/5 border border-white/10"
              }`}
            >
              <FileText className="w-4 h-4" />
              Incoming Inquiries
              {pendingInquiries > 0 && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full ml-auto font-sans ${
                  activeTab === 'inquiries' ? "bg-black text-gold font-extrabold" : "bg-gold text-black"
                }`}>
                  {pendingInquiries}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full text-left py-3.5 px-4 rounded text-xs font-bold font-serif uppercase tracking-widest flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'products'
                  ? "bg-gold text-black shadow-lg"
                  : "bg-[#111] text-stone-400 hover:bg-white/5 border border-white/10"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              Products Inventory
            </button>

            <button
              onClick={() => {
                setActiveTab('configurator');
                setEditingId(null);
              }}
              className={`w-full text-left py-3.5 px-4 rounded text-xs font-bold font-serif uppercase tracking-widest flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'configurator'
                  ? "bg-gold text-black shadow-lg"
                  : "bg-[#111] text-stone-400 hover:bg-white/5 border border-white/10"
              }`}
            >
              <Plus className="w-4 h-4" />
              {editingId ? "Update Product" : "Launch Product"}
            </button>
          </div>

          {/* Right principal desk panel */}
          <div className="lg:col-span-9 bg-[#111111] border border-white/[0.08] rounded p-6 lg:p-8 min-h-[480px]">
            
            {/* TAB 1: Incoming Inquiries list */}
            {activeTab === 'inquiries' && (
              <div>
                <div className="border-b border-white/10 pb-5 mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-base tracking-wide text-white">
                      Worldwide Client Sourcing Requests
                    </h3>
                    <p className="font-sans text-xs text-stone-400 mt-1">
                      Direct trade sourcing requests generated by national and corporate export accounts.
                    </p>
                  </div>
                  <span className="bg-gold/10 text-gold border border-gold/20 font-mono text-[9px] font-bold px-3 py-1 rounded uppercase tracking-wider block">
                    Direct-Route Active
                  </span>
                </div>

                {inquiries.length === 0 ? (
                  <div className="text-center py-16 bg-[#0A0A0A] border border-white/5 rounded">
                    <Mail className="w-8 h-8 text-stone-650 mx-auto mb-2" />
                    <p className="font-sans text-xs text-stone-450">No wholesale client submissions currently active.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {inquiries.map((iq) => (
                      <div 
                        key={iq.id} 
                        className={`p-5 rounded border transition-all ${
                          iq.status === 'pending' 
                            ? 'border-gold bg-gold/[0.02]' 
                            : 'border-white/5 bg-[#0A0A0A]/50'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 pb-3 border-b border-dashed border-white/10">
                          <div>
                            <span className="bg-gold text-black px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-widest block w-max mb-2 font-bold select-none text-stone-900">
                              {iq.productCategory || "Brand General"}
                            </span>
                            <h4 className="font-serif text-sm text-[#DFBF82] tracking-wide flex items-center gap-2 flex-wrap">
                              {iq.customerName}
                              <span className="text-[10px] font-mono text-stone-450 font-normal">({iq.customerEmail})</span>
                            </h4>
                            {iq.customerPhone && (
                              <p className="font-mono text-[10px] text-stone-400 mt-1">📞 {iq.customerPhone}</p>
                            )}
                          </div>
                          
                          <div className="flex flex-col items-end gap-1.5">
                            <span className="font-mono text-[9px] text-[#A58039]">
                              {new Date(iq.createdAt).toLocaleString()}
                            </span>
                            
                            {/* Current Sourcing status badge */}
                            <span className={`px-2 py-0.5 rounded font-mono text-[8px] uppercase tracking-widest inline-block border ${
                              iq.status === 'pending'
                                ? 'bg-gold/5 text-gold border-gold/20'
                                : iq.status === 'reviewed'
                                ? 'bg-white/5 text-stone-300 border-white/10'
                                : 'bg-stone-900 text-stone-500 border-stone-850'
                            }`}>
                              {iq.status}
                            </span>
                          </div>
                        </div>

                        {/* Inquiry Request Content text */}
                        <p className="font-sans text-xs text-stone-300 leading-relaxed bg-[#0A0A0A] p-4 border border-white/5 rounded whitespace-pre-wrap">
                          {iq.message}
                        </p>

                        {/* Sourcing update interactive calls */}
                        {iq.status !== 'resolved' && (
                          <div className="mt-4 flex gap-2 justify-end">
                            {iq.status === 'pending' && (
                              <button
                                onClick={() => onUpdateInquiryStatus(iq.id, 'reviewed')}
                                className="px-3 py-1.5 rounded border border-gold/30 bg-gold/10 hover:bg-gold/20 text-[#DFBF82] text-[9px] font-serif font-bold uppercase tracking-widest transition-all cursor-pointer"
                              >
                                Mark as Contacted
                              </button>
                            )}
                            <button
                              onClick={() => onUpdateInquiryStatus(iq.id, 'resolved')}
                              className="px-3.5 py-1.5 rounded bg-gold hover:bg-[#A58039] text-black text-[9px] font-serif font-bold uppercase tracking-widest transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3 h-3 text-black" />
                              Archive Resolution
                            </button>
                          </div>
                        )}

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Products items inventory management list */}
            {activeTab === 'products' && (
              <div>
                <div className="border-b border-white/10 pb-5 mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-base tracking-wide text-white">
                      Registered Sourcing Catalog Directory
                    </h3>
                    <p className="font-sans text-xs text-stone-400 mt-1">
                      Track unit wholesale prices, production areas, and exact stock measurements.
                    </p>
                  </div>
                  <button
                    onClick={() => { setActiveTab('configurator'); setEditingId(null); }}
                    className="py-1.5 px-3.5 rounded bg-gold hover:bg-[#A58039] text-black text-[10px] font-serif font-bold tracking-widest uppercase transition-colors cursor-pointer"
                  >
                    Launch New Good
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 font-mono text-[9px] uppercase tracking-widest text-[#C5A059] bg-[#0A0A0A]">
                        <th className="py-3 px-4 font-bold">Catalog Item</th>
                        <th className="py-3 px-4 font-bold col-wholesale">FOB Wholesale Value</th>
                        <th className="py-3 px-4 font-bold">Sourcing Origin</th>
                        <th className="py-3 px-4 font-bold">Available Stocks</th>
                        <th className="py-3 px-4 text-right font-bold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {products.map((item) => (
                        <tr key={item.id} className="hover:bg-white/[0.03] transition-colors border-b border-white/5">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 object-cover rounded border border-white/10 shrink-0 bg-black/40" 
                              />
                              <div>
                                <span className="block font-serif text-xs font-bold text-white leading-tight">
                                  {item.name}
                                </span>
                                <span className="inline-block mt-1 font-mono text-[8px] uppercase tracking-widest text-gold bg-gold/10 px-1.5 py-0.5 rounded">
                                  {item.category}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-mono text-xs font-bold text-[#DFBF82]">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="py-4 px-4 text-xs font-sans text-stone-400">
                            {item.attributes.origin?.split(",")[0] || "Sri Lanka"}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`font-mono text-xs font-bold ${
                              item.stock > 15 ? "text-stone-330" : "text-amber-500 font-extrabold"
                            }`}>
                              {item.stock} Units
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="inline-flex gap-1.5">
                              <button
                                onClick={() => handleStartEdit(item)}
                                className="p-2 border border-white/10 rounded text-[#DFBF82] hover:text-white hover:bg-white/10 transition-colors cursor-pointer bg-[#0A0A0A]"
                                title="Edit details"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm(`Confirm deletion of database index for: ${item.name}?`)) {
                                    await onDeleteProduct(item.id);
                                  }
                                }}
                                className="p-2 border border-red-950 bg-red-950/10 rounded text-red-400 hover:bg-red-900/40 transition-colors cursor-pointer"
                                title="Delete index"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* TAB 3: Configurator / Add product & AI description generator */}
            {activeTab === 'configurator' && (
              <div>
                <div className="border-b border-white/10 pb-5 mb-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-serif text-base tracking-wide text-white">
                      {editingId ? `Update Core Index: ${prodName}` : "Create/Launch Authentic Good Record"}
                    </h3>
                    <p className="font-sans text-xs text-stone-400 mt-1">
                      Setup organic parameters, unit stock counts, and trigger instant copywriting drafting with Gemini AI.
                    </p>
                  </div>
                  
                  {editingId && (
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setProdName("");
                        setProdDescription("");
                        setProdPrice("");
                        setProdStock("50");
                      }}
                      className="text-[10px] font-mono tracking-widest bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10 px-3 py-1 rounded cursor-pointer uppercase"
                    >
                      Cancel Edit Mode
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Left Column Input fields */}
                  <form onSubmit={handleCreateOrUpdateProduct} className="md:col-span-7 space-y-4">
                    
                    <div>
                      <label className="block text-[9px] uppercase font-mono font-bold tracking-widest text-[#C5A059] mb-1.5">
                        Product Sourcing Label Title
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Niera Wild-Harvested Kandy Cloves"
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded text-white focus:border-gold focus:outline-none text-xs font-sans placeholder-stone-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] uppercase font-mono font-bold tracking-widest text-[#C5A059] mb-1.5">
                          Sourcing Branch
                        </label>
                        <select
                          value={prodCategory}
                          onChange={(e) => setProdCategory(e.target.value as any)}
                          className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded text-white focus:border-gold focus:outline-none text-xs font-sans cursor-pointer"
                        >
                          <option value="spices">Niera Spices</option>
                          <option value="fashion">Niera Fashion</option>
                          <option value="accessories">Niera Accessories</option>
                          <option value="drinks">Healthy Energy Drinks</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase font-mono font-bold tracking-widest text-[#C5A059] mb-1.5">
                          FOB Wholesale Price ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          placeholder="e.g. 19.50"
                          value={prodPrice}
                          onChange={(e) => setProdPrice(e.target.value)}
                          className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded text-white focus:border-gold focus:outline-none text-xs font-sans placeholder-stone-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] uppercase font-mono font-bold tracking-widest text-[#C5A059] mb-1.5">
                          Sri Lankan Growing Division
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Matale, Sri Lanka"
                          value={prodOrigin}
                          onChange={(e) => setProdOrigin(e.target.value)}
                          className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded text-white focus:border-gold focus:outline-none text-xs font-sans placeholder-stone-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase font-mono font-bold tracking-widest text-[#C5A059] mb-1.5">
                          Launch Inventory Volume
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 100"
                          value={prodStock}
                          onChange={(e) => setProdStock(e.target.value)}
                          className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded text-white focus:border-gold focus:outline-none text-xs font-sans placeholder-stone-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase font-mono font-bold tracking-widest text-[#C5A059] mb-1.5">
                        Specific Grade / Upcycling Material Composition
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ALBA Quills / High-fiber Flax / Upcycled Shell"
                        value={prodGradeOrMaterial}
                        onChange={(e) => setProdGradeOrMaterial(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded text-white focus:border-gold focus:outline-none text-xs font-sans placeholder-stone-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase font-mono font-bold tracking-widest text-[#C5A059] mb-1.5">
                        Core Description Copywriter *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Input manually or trigger the AI drafting widget on the right hand side to write absolute premium storytelling segments powered by Gemini..."
                        value={prodDescription}
                        onChange={(e) => setProdDescription(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded text-white focus:border-gold focus:outline-none text-xs font-sans placeholder-stone-600"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-4 rounded bg-gold hover:bg-[#A58039] text-black font-serif text-xs font-bold uppercase tracking-widest transition-all hover:scale-[1.01] cursor-pointer shadow-lg"
                      >
                        {editingId ? "Update Registered Good Index" : "Deploy Sourcing Good To Catalog"}
                      </button>
                    </div>

                  </form>

                  {/* Right Column Custom AI Content generator widget */}
                  <div className="md:col-span-5 bg-gold/[0.02] border border-gold/15 rounded p-6 relative">
                    <div className="flex items-center gap-1.5 text-gold mb-3">
                      <Sparkles className="w-4 h-4 text-gold animate-pulse" />
                      <h4 className="font-serif text-xs font-bold uppercase tracking-widest">
                        AI Copywriter Dispatcher
                      </h4>
                    </div>

                    <p className="font-sans text-[11px] text-stone-400 leading-relaxed mb-4">
                      Let Gemini write premium, authentic descriptions for spices, luxury resort fashion, coconut accessories, or hydration formulas automatically.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[9px] uppercase font-mono font-bold tracking-widest text-stone-450 mb-1">
                          Product keywords (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Sweet, handloom, organic, Galle"
                          value={aiKeywords}
                          onChange={(e) => setAiKeywords(e.target.value)}
                          className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 text-white rounded focus:border-gold focus:outline-none text-xs font-sans placeholder-stone-600"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleGenerateAICopy}
                        disabled={isGeneratingAI || !prodName}
                        className="w-full py-2.5 rounded bg-stone-950 hover:bg-stone-900 border border-white/10 text-[#DFBF82] font-serif text-[10px] uppercase tracking-widest transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-stone-900 disabled:text-stone-600"
                      >
                        {isGeneratingAI ? (
                          <span>AI Drafting Copy...</span>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-gold" />
                            Draft with Gemini AI
                          </>
                        )}
                      </button>

                      {/* Info warning */}
                      <div className="bg-[#0A0A0A] text-[#DFBF82]/90 p-3.5 rounded border border-white/5 text-[10px] font-mono leading-relaxed mt-4 flex gap-2">
                        <Info className="w-4 h-4 shrink-0 text-gold stroke-[1.5]" />
                        <span>The text generated is optimized automatically for regional exporter labels and wholesale distribution criteria. No manual drafting needed.</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
