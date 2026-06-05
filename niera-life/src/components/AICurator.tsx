import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, User, ShieldCheck, RefreshCw, MessageSquare } from "lucide-react";

interface AICuratorProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

const STARTER_PROMPTS = [
  "What is Alba Grade Cinnamon & its therapeutic benefits?",
  "Suggest a stylish resort-wear linen look from Niera Fashion.",
  "Which daily energy shots are recommended for brain-boosting?",
  "Tell me the craftsmanship behind the Coconut Shell Bracelets."
];

export default function AICurator({ isOpen, onClose }: AICuratorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Ayubowan! Welcome to NIERA's AI Wellness & Styling Concierge. I can guide you through the history of Ceylon Spices, curate elegant resort wardrobes, details our sustainably upcycled coconut accessories, or suggest customized King Coconut wellness formulations. What can I explore with you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: "msg-" + Date.now(),
      sender: "user",
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/agent/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text })
      });

      if (!response.ok) {
        throw new Error("Curator response failed");
      }

      const data = await response.json();
      
      const aiMsg: Message = {
        id: "ai-" + Date.now(),
        sender: "ai",
        text: data.text || "I apologize, but I struggled to analyze your request. Please ask again.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI Assistant error:", error);
      const errorMsg: Message = {
        id: "err-" + Date.now(),
        sender: "ai",
        text: "I am having trouble connecting to our Sri Lankan server hubs. Don't worry, the local farms are processing fine! Please try sending your query again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#0D0D0D] text-white shadow-2xl flex flex-col justify-between border-l border-white/[0.08]">
      
      {/* Header Panel */}
      <div className="p-6 border-b border-white/[0.08] bg-[#0A0A0A] flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center border border-gold/30">
            <Sparkles className="w-4 h-4 text-gold" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm leading-tight text-white">AI Concierge Assistant</h3>
            <span className="font-mono text-[9px] uppercase tracking-wider text-gold-light/60">NIERA LIFE Pvt Ltd • Secure</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-stone-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-grow overflow-y-auto p-6 space-y-4 class-message-wrapper">
        <div className="flex justify-center mb-2">
          <span className="font-mono text-[8px] bg-gold/10 border border-gold/20 px-3 py-1 rounded text-[#DFBF82] tracking-wider font-bold">
            SECURE LIVE INTERACTION ENCRYPTED
          </span>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${
              msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            {/* Avatar block */}
            <div className={`w-7 h-7 rounded shrink-0 flex items-center justify-center font-mono font-bold text-[10px] ${
              msg.sender === "user" ? "bg-gold text-black" : "bg-gold/10 text-gold border border-gold/30"
            }`}>
              {msg.sender === "user" ? <User className="w-3.5 h-3.5 text-black" /> : "N"}
            </div>

            {/* Bubble contents */}
            <div className={`p-4 rounded text-xs leading-relaxed ${
              msg.sender === "user"
                ? "bg-gold text-black rounded-tr-none font-medium"
                : "bg-[#151515] text-[#DFBF82]/90 rounded-tl-none border border-white/[0.08]"
            }`}>
              <p className="whitespace-pre-line">{msg.text}</p>
              <span className={`block font-mono text-[8px] mt-2 ${
                msg.sender === "user" ? "text-stone-850/80" : "text-stone-500"
              }`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 max-w-[80%] mr-auto items-center">
            <div className="w-7 h-7 rounded bg-gold/10 text-gold border border-gold/30 flex items-center justify-center font-mono text-[10px]">
              N
            </div>
            <div className="bg-[#151515] border border-white/[0.08] py-3.5 px-4 rounded rounded-tl-none flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Starterprompts footer */}
      {messages.length === 1 && (
        <div className="px-6 py-3 border-t border-white/[0.08] bg-[#0A0A0A]">
          <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-widest font-bold mb-2">
            Suggested Sourcing Directions
          </label>
          <div className="flex flex-col gap-1.5">
            {STARTER_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(prompt)}
                className="w-full text-left py-2 px-3 bg-[#151515] hover:bg-[#1C1C1C] border border-white/5 rounded font-sans text-xs text-[#DFBF82]/90 hover:text-white transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input controls */}
      <div className="p-6 border-t border-white/[0.08] bg-[#0A0A0A]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputValue);
          }}
          className="flex gap-2 relative items-center"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isTyping}
            placeholder="Ask Niera AI about spices, styling, accessories..."
            className="w-full pl-4 pr-12 py-3 bg-[#151515] border border-white/10 rounded focus:border-gold focus:outline-none text-xs text-stone-100 placeholder-stone-605 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isTyping || !inputValue.trim()}
            className="absolute right-2 p-2 rounded bg-gold hover:bg-[#A58039] disabled:bg-stone-800 text-black transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <span className="block text-center font-mono text-[8.5px] text-stone-400 mt-3 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3 text-gold" />
          GUARANTEED SOURCE METRICS • POWERED BY GEMINI AI
        </span>
      </div>

    </div>
  );
}
