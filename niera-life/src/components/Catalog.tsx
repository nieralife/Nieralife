import { useState } from "react";
import { Product, CategoryType } from "../types";
import { Search, Filter, Mail, Globe, MapPin, Tag, RefreshCw, Layers } from "lucide-react";

interface CatalogProps {
  products: Product[];
  currentCategory: string;
  onSelectCategory: (cat: string) => void;
  onInquire: (product: Product) => void;
  isLoading: boolean;
  onRefresh: () => void;
}

export default function Catalog({
  products,
  currentCategory,
  onSelectCategory,
  onInquire,
  isLoading,
  onRefresh
}: CatalogProps) {
  const [search, setSearch] = useState("");
  const [selectedOrigin, setSelectedOrigin] = useState("all");

  // Filtering products
  const categoryFiltered = currentCategory === "all"
    ? products
    : products.filter(p => p.category === currentCategory);

  const finalFiltered = categoryFiltered.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.description.toLowerCase().includes(search.toLowerCase());
    const matchesOrigin = selectedOrigin === "all" || 
                          (p.attributes.origin && p.attributes.origin.toLowerCase().includes(selectedOrigin.toLowerCase()));
    return matchesSearch && matchesOrigin;
  });

  // Extract all unique origins for filtering list
  const origins = Array.from(new Set(
    products
      .map(p => p.attributes.origin?.split(",")[0] || "")
      .filter(Boolean)
  ));

  const tabs: { id: string; label: string }[] = [
    { id: "all", label: "All Items" },
    { id: "spices", label: "Ceylon Spices" },
    { id: "fashion", label: "Contemporary Fashion" },
    { id: "accessories", label: "Artisan Accessories" },
    { id: "drinks", label: "Healthy/Energy Drinks" }
  ];

  return (
    <div id="catalog-section" className="bg-[#0A0A0A] min-h-screen py-16 text-white border-t border-white/[0.08] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-px bg-gold" />
              <span className="font-mono text-[10px] text-gold uppercase tracking-[0.25em] font-bold">
                Export Collection Catalog
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extralight tracking-wide text-white">
              Browse Organic <span className="font-semibold text-[#DFBF82]">Authenticity</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onRefresh}
              className="p-2 border border-white/10 rounded hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
              title="Refresh inventory"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <div className="text-right text-xs font-mono text-stone-500">
              Showing {finalFiltered.length} of {products.length} cataloged products
            </div>
          </div>
        </div>

        {/* Division switcher with modern sub-pills */}
        <div className="flex flex-wrap gap-2.5 mb-10">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onSelectCategory(tab.id)}
              className={`px-5 py-3 rounded font-serif text-xs font-semibold tracking-widest transition-all duration-300 uppercase cursor-pointer ${
                currentCategory === tab.id
                  ? "bg-gold text-black shadow-lg shadow-gold/10"
                  : "bg-[#111111] text-stone-400 hover:text-white hover:bg-[#161616] border border-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Catalog Control Toolbar (Filters & Search) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8 bg-[#111111] p-4 rounded border border-white/[0.08]">
          {/* Search bar */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
            <input
              type="text"
              placeholder="Search spices, apparel, organic ingredients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#0A0A0A] border border-white/10 rounded text-white focus:outline-none focus:border-gold font-sans text-xs tracking-wide"
            />
          </div>

          {/* District Sourcing Filter */}
          <div className="md:col-span-3 relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
            <select
              value={selectedOrigin}
              onChange={(e) => setSelectedOrigin(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#0A0A0A] border border-white/10 rounded text-stone-200 focus:outline-none focus:border-gold font-sans text-xs tracking-wide appearance-none cursor-pointer"
            >
              <option value="all" className="bg-[#111111]">All Sourcing Districts</option>
              {origins.map((origin) => (
                <option key={origin} value={origin} className="bg-[#111111]">{origin}</option>
              ))}
            </select>
          </div>

          {/* Quick Clear Button */}
          <div className="md:col-span-3 flex justify-end">
            {(search || selectedOrigin !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedOrigin("all");
                }}
                className="w-full py-3 border border-white/10 text-stone-300 hover:border-gold/30 bg-[#0A0A0A] rounded text-xs font-semibold hover:text-white transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {finalFiltered.length === 0 ? (
          <div className="text-center py-20 bg-[#111111] rounded border border-dashed border-white/10">
            <Layers className="w-10 h-10 text-stone-600 mx-auto mb-4" />
            <h3 className="font-serif text-white text-lg font-light">No authentic products found</h3>
            <p className="font-sans text-xs text-stone-400 mt-1 max-w-sm mx-auto">
              We couldn't locate any matching items. Try widening your search queries or selecting another category above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {finalFiltered.map((product) => (
              <div
                key={product.id}
                className="group border border-white/[0.08] rounded bg-[#111111] overflow-hidden shadow-xl hover:border-gold/35 transition-all flex flex-col justify-between"
              >
                {/* Product Image Section */}
                <div>
                  <div className="aspect-[4/3] w-full overflow-hidden bg-stone-900 relative border-b border-white/[0.08]">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />

                    {/* Stock status indicator overlay */}
                    <span className={`absolute bottom-3 right-3 font-mono text-[8px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-sm border ${
                      product.stock > 15
                        ? "bg-[#0A0A0A]/90 text-[#DFBF82] border-gold/20"
                        : "bg-red-950/90 text-red-400 border-red-800/40"
                    }`}>
                      {product.stock > 15 ? `In Stock: ${product.stock}` : `Low Stock: ${product.stock}`}
                    </span>

                    {/* Category Label overlay */}
                    <span className="absolute top-3 left-3 bg-gold text-black px-2.5 py-1 rounded-sm text-[8px] font-mono font-bold uppercase tracking-widest">
                      {product.category}
                    </span>
                  </div>

                  {/* Core info body */}
                  <div className="p-6">
                    <div className="flex items-center gap-1.5 text-[#C5A059] mb-2">
                      <MapPin className="w-3.5 h-3.5 text-gold stroke-[2]" />
                      <span className="font-mono text-[9px] uppercase tracking-widest font-bold text-stone-400">
                        {product.attributes.origin?.split(",")[0] || "Sri Lanka Sourced"}
                      </span>
                    </div>

                    <h3 className="font-serif text-base font-bold text-white leading-snug tracking-wide mb-2 group-hover:text-gold transition-colors">
                      {product.name}
                    </h3>

                    <p className="font-sans text-xs text-stone-400 line-clamp-3 leading-relaxed mb-4">
                      {product.description}
                    </p>

                    {/* Tailored Product Specific Badges */}
                    <div className="py-3 border-t border-b border-white/[0.06] flex flex-wrap gap-2 mb-4">
                      {product.attributes.grade && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0A0A0A] border border-gold/20 text-[9px] font-semibold text-gold-light font-sans">
                          Grade: {product.attributes.grade}
                        </span>
                      )}
                      
                      {product.attributes.material && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0A0A0A] border border-white/10 text-[9px] font-semibold text-stone-300 font-sans">
                          {product.attributes.material}
                        </span>
                      )}

                      {product.attributes.sizes && product.attributes.sizes.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0A0A0A] border border-white/5 text-[9px] font-mono text-stone-400">
                          Sizes: {product.attributes.sizes.join(", ")}
                        </span>
                      )}

                      {product.attributes.ingredients && product.attributes.ingredients.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-gold/10 border border-gold/20 text-[9px] text-gold-light font-sans font-medium line-clamp-1">
                          Pure Organic Extract
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pricing & CTA inquiry checkout trigger */}
                <div className="px-6 pb-6 pt-2 flex items-center justify-between mt-auto">
                  <div>
                    <span className="block text-[8px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                      SAMPLE RETAIL
                    </span>
                    <span className="font-mono text-base font-extrabold text-white block mt-0.5">
                      ${product.price.toFixed(2)}
                      <span className="text-[10px] font-medium text-stone-500 font-sans"> / FOB</span>
                    </span>
                  </div>

                  <button
                    onClick={() => onInquire(product)}
                    className="px-5 py-2.5 rounded bg-gold hover:bg-[#A58039] text-black font-serif text-xs font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-black" />
                    Inquire Sourcing
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
