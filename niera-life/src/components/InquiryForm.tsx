import React, { useState } from "react";
import { Product, Inquiry } from "../types";
import { Mail, CheckCircle, X, HelpCircle, Phone, Info } from "lucide-react";

interface InquiryFormProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (inquiryData: Omit<Inquiry, "id" | "status" | "createdAt">) => Promise<boolean>;
}

export default function InquiryForm({ product, isOpen, onClose, onSubmit }: InquiryFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [inquiryType, setInquiryType] = useState<"wholesale" | "retail" | "custom">("wholesale");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsLoading(true);

    const formattedMessage = `[Inquiry Type: ${inquiryType.toUpperCase()}]\n` +
      `Product Interest: ${product ? product.name : "General Brand Sourcing"}\n\n` +
      message;

    const data = {
      productId: product?.id,
      productName: product?.name,
      productCategory: product?.category,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      message: formattedMessage
    };

    const success = await onSubmit(data);
    setIsLoading(false);
    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
        onClose();
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-[#111111] rounded shadow-2xl overflow-hidden border border-white/[0.08] flex flex-col justify-between text-white">
        
        {/* Header bar */}
        <div className="px-8 py-6 bg-[#0A0A0A] text-white flex justify-between items-center border-b border-white/[0.08]">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-gold font-bold block">
              Direct Trade Sourcing
            </span>
            <h3 className="font-serif text-lg tracking-wide mt-1">
              {product ? `Inquire: ${product.name}` : "Exotic Sourcing Request"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-8">
          {isSuccess ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-gold mx-auto mb-4 stroke-[1.5]" />
              <h4 className="font-serif text-white font-light text-xl">Inquiry Submitted</h4>
              <p className="font-sans text-xs text-stone-400 mt-3 max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out. A NIERA LIFE export operations specialist will review your specifications and respond via email within 24 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Sourcing type toggle buttons */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold mb-2">
                  Sourcing Classification
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "wholesale", label: "Wholesale (Bulk)" },
                    { id: "retail", label: "Sample Pack" },
                    { id: "custom", label: "Custom Label" }
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setInquiryType(btn.id as any)}
                      className={`py-2 px-3 rounded text-xs font-semibold tracking-wide transition-all uppercase font-sans cursor-pointer ${
                        inquiryType === btn.id
                          ? "border-gold bg-gold/15 text-gold-light font-bold"
                          : "border-white/10 bg-[#0A0A0A] text-stone-400 hover:bg-white/5"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Informative alert to represent our direct-trade values */}
              <div className="flex gap-2.5 bg-gold/5 border border-gold/15 rounded p-3.5">
                <Info className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <p className="font-sans text-[11px] text-gold-light/95 leading-relaxed">
                  All submissions are dispatched straight to our grower hubs in Galle and Kandy. No retail middlemen. Safe, certified, and completely unadulterated directly from Sri Lanka.
                </p>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-widest font-bold text-stone-400 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded focus:border-gold text-white focus:outline-none text-xs font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-widest font-bold text-stone-400 mb-1.5">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded focus:border-gold text-white focus:outline-none text-xs font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-widest font-bold text-stone-400 mb-1.5">
                  Contact Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]" />
                  <input
                    type="text"
                    placeholder="+94 XX XXX XXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#0A0A0A] border border-white/10 rounded focus:border-gold text-white focus:outline-none text-xs font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-widest font-bold text-stone-400 mb-1.5">
                  Specification Details *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={
                    product 
                      ? "List required weight quantity, requested delivery timeframe, customization dimensions, or private branding requests..." 
                      : "Describe your custom spice export request, bulk wellness drink volume, or resort textile order guidelines..."
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded focus:border-gold text-white focus:outline-none text-xs font-sans"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded bg-gold hover:bg-[#A58039] disabled:bg-stone-800 text-black text-xs font-serif font-bold uppercase tracking-widest transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  {isLoading ? (
                    <span>Dispatching Request...</span>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 text-black" />
                      Submit Sourcing Specification
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
