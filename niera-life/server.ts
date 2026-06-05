import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { Product, Inquiry, CategoryType } from "./src/types";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize GoogleGenAI SDK
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

app.use(express.json());

// Database paths
const PRODUCTS_DB_PATH = path.join(process.cwd(), "products-db.json");
const INQUIRIES_DB_PATH = path.join(process.cwd(), "inquiries-db.json");

// Helper to write to log file or console
const serverLog = (message: string) => {
  console.log(`[NIERA BACKEND] ${new Date().toISOString()} - ${message}`);
};

// Seed initial products
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Niera Alba Grade Ceylon Cinnamon",
    category: "spices",
    description: "The rarest and most premium grade of Sri Lankan Ceylon cinnamon. Delicately sweet woodsy flavor, hand-rolled in Galle's heritage farms. Rich in wellness compounds.",
    price: 34.50,
    image: "/src/assets/images/niera_spices_hero_1780671021164.png",
    stock: 120,
    attributes: {
      origin: "Southern Province (Galle), Sri Lanka",
      grade: "ALBA (Thinnest Quills, Hand-rolled)",
      material: "100% Organic Ceylon Cinnamon (Cinnamomum verum)"
    }
  },
  {
    id: "prod-2",
    name: "Niera Matale Cracked Black Pepper",
    category: "spices",
    description: "Picked at maximum maturity in the Matale spice gardens. Sun-dried then cracked to release high piperine warmth, delivering an intense aroma with citrus undertone.",
    price: 18.00,
    image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=600",
    stock: 240,
    attributes: {
      origin: "Central Highlands (Matale), Sri Lanka",
      grade: "Grade-A Heavy Berry",
      material: "Organic Black Pepper"
    }
  },
  {
    id: "prod-3",
    name: "Niera Heritage Organic Saree - Ocean Indigo",
    category: "fashion",
    description: "Woven by traditional handloom artisans in Northern Sri Lanka. Ethically sourced combed cotton dyed in rich natural indigo extracts with historic geometric borders.",
    price: 145.00,
    image: "/src/assets/images/niera_fashion_hero_1780671036505.png",
    stock: 12,
    attributes: {
      origin: "Northern Province, Sri Lanka",
      material: "100% Cotton Handloom",
      sizes: ["Free Size (6 Yards)"]
    }
  },
  {
    id: "prod-4",
    name: "Niera Tropical Resort Linen Shirt",
    category: "fashion",
    description: "Modern, featherlight, and exceptionally breathable pure flax linen shirt. Tailored beautifully for humid tropical sun and evening luxury seaside dining alike.",
    price: 78.50,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=600",
    stock: 45,
    attributes: {
      origin: "Colombo Boutique Atelier",
      material: "100% Flax Linen",
      sizes: ["S", "M", "L", "XL"]
    }
  },
  {
    id: "prod-5",
    name: "Niera King Coconut Hydration Elixir",
    category: "drinks",
    description: "Pure orange King Coconut water from Sri Lankan groves, minimally processed and infused with crushed wild mint leaves and a delicate spritz of fresh lime.",
    price: 4.80,
    image: "/src/assets/images/niera_drinks_hero_1780671051779.png",
    stock: 400,
    attributes: {
      origin: "Chilaw Coconut Groves, Sri Lanka",
      ingredients: ["Fresh King Coconut Water", "Aromatic Mint", "Organic Lime juice"],
      servingTemp: "Chilled (4-6°C)"
    }
  },
  {
    id: "prod-6",
    name: "Niera Golden Turmeric & Ginger Vitality Tonic",
    category: "drinks",
    description: "Press-extracted Sri Lankan turmeric rhizomes, pungent ginger, wild jungle honey, and a microscopic pinch of black pepper to maximize natural absorption.",
    price: 5.50,
    image: "https://images.unsplash.com/photo-1621506289937-a8e4e279397f?auto=format&fit=crop&q=80&w=600",
    stock: 350,
    attributes: {
      origin: "Kandy Organic Gardens",
      ingredients: ["Raw Turmeric Juice", "Mountain Ginger", "Wild Forest Honey", "Matale Black Pepper"],
      servingTemp: "Chilled or Warmed"
    }
  },
  {
    id: "prod-7",
    name: "Niera Hand-Woven Reed Beach Tote",
    category: "accessories",
    description: "Meticulously double-layered beach tote woven from wild coastal reeds. Styled with recycled genuine leather straps and hand-carved coconut wood toggles.",
    price: 65.00,
    image: "/src/assets/images/niera_accessories_hero_1780671065326.png",
    stock: 22,
    attributes: {
      origin: "Hambantota Artisans, Sri Lanka",
      material: "Hand-harvested River Reed & Sourced Leather"
    }
  },
  {
    id: "prod-8",
    name: "Niera Coconut Shell Cuff Bracelet",
    category: "accessories",
    description: "Finely sanded and high-buffed organically dyed slice of natural coconut shell. Features hand-stamped traditional copper and brass inlay, made in small batches.",
    price: 29.00,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600",
    stock: 60,
    attributes: {
      origin: "Ambalangoda Crafts Association",
      material: "Sustained Coconut Shell & Upcycled Brass"
    }
  }
];

// Seed initial inquiries
const DEFAULT_INQUIRIES: Inquiry[] = [
  {
    id: "inq-1",
    productId: "prod-1",
    productName: "Niera Alba Grade Ceylon Cinnamon",
    productCategory: "spices",
    customerName: "Julian Vane",
    customerEmail: "julian@gourmetfoods.co.uk",
    customerPhone: "+44 7911 123456",
    message: "We are an organic condiment distributor in London. We would like to inquire about wholesale shipping rates for a bulk order of 25kg of ALBA Grade Cinnamon quills. Please share your current container capacity and spice health certificates.",
    status: "pending",
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
  },
  {
    id: "inq-2",
    productId: "prod-3",
    productName: "Niera Heritage Organic Saree - Ocean Indigo",
    productCategory: "fashion",
    customerName: "Priya Silva",
    customerEmail: "priya.silva@gmail.com",
    customerPhone: "+94 77 123 4567",
    message: "The Indigo handloom saree is gorgeous. I’d love to request customized blouse embroidery. Do your Colombo design team offer bespoke hand-stitch work prior to shipping?",
    status: "reviewed",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  },
  {
    id: "inq-3",
    customerName: "Dr. Hans Weber",
    customerEmail: "hans.weber@biomed-munich.de",
    customerPhone: "+49 89 245671",
    message: "General partnership inquiry. We are looking for clean label sourcing of Srilankan Gotukola, Green Tea, and Ginger extracts for a new natural carbonated health soda product line in Germany.",
    status: "pending",
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
  }
];

// Load Products from DB
const readProducts = (): Product[] => {
  try {
    if (fs.existsSync(PRODUCTS_DB_PATH)) {
      const data = fs.readFileSync(PRODUCTS_DB_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    serverLog("Error reading products db: " + error);
  }
  // Store default if not present
  writeProducts(DEFAULT_PRODUCTS);
  return DEFAULT_PRODUCTS;
};

// Save Products to DB
const writeProducts = (products: Product[]) => {
  try {
    fs.writeFileSync(PRODUCTS_DB_PATH, JSON.stringify(products, null, 2), "utf-8");
  } catch (error) {
    serverLog("Error writing products db: " + error);
  }
};

// Load Inquiries from DB
const readInquiries = (): Inquiry[] => {
  try {
    if (fs.existsSync(INQUIRIES_DB_PATH)) {
      const data = fs.readFileSync(INQUIRIES_DB_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    serverLog("Error reading inquiries db: " + error);
  }
  // Store default if not present
  writeInquiries(DEFAULT_INQUIRIES);
  return DEFAULT_INQUIRIES;
};

// Save Inquiries to DB
const writeInquiries = (inquiries: Inquiry[]) => {
  try {
    fs.writeFileSync(INQUIRIES_DB_PATH, JSON.stringify(inquiries, null, 2), "utf-8");
  } catch (error) {
    serverLog("Error writing inquiries db: " + error);
  }
};

// Products API Routes
app.get("/api/products", (req, res) => {
  const products = readProducts();
  res.json(products);
});

app.post("/api/products", (req, res) => {
  const products = readProducts();
  const { name, category, description, price, image, stock, attributes } = req.body;

  if (!name || !category || !price) {
    return res.status(400).json({ error: "Missing required product fields (name, category, price)" });
  }

  const newProduct: Product = {
    id: "prod-" + Date.now(),
    name,
    category,
    description: description || "",
    price: Number(price),
    image: image || "https://picsum.photos/seed/niera/600/450",
    stock: stock !== undefined ? Number(stock) : 50,
    attributes: attributes || {}
  };

  products.unshift(newProduct);
  writeProducts(products);
  serverLog(`Added new product: ${name}`);
  res.status(201).json(newProduct);
});

app.put("/api/products/:id", (req, res) => {
  const products = readProducts();
  const { id } = req.params;
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  const updatedProduct = {
    ...products[index],
    ...req.body,
    id // preserve original id
  };

  products[index] = updatedProduct;
  writeProducts(products);
  serverLog(`Updated product: ${updatedProduct.name}`);
  res.json(updatedProduct);
});

app.delete("/api/products/:id", (req, res) => {
  const products = readProducts();
  const { id } = req.params;
  const filtered = products.filter(p => p.id !== id);

  if (products.length === filtered.length) {
    return res.status(404).json({ error: "Product not found" });
  }

  writeProducts(filtered);
  serverLog(`Deleted product ID: ${id}`);
  res.json({ success: true, message: "Product deleted successfully" });
});

// Inquiries API Routes
app.get("/api/inquiries", (req, res) => {
  const inquiries = readInquiries();
  res.json(inquiries);
});

app.post("/api/inquiries", (req, res) => {
  const inquiries = readInquiries();
  const { productId, productName, productCategory, customerName, customerEmail, customerPhone, message } = req.body;

  if (!customerName || !customerEmail || !message) {
    return res.status(400).json({ error: "Missing required fields (customerName, customerEmail, message)" });
  }

  const newInquiry: Inquiry = {
    id: "inq-" + Date.now(),
    productId,
    productName,
    productCategory,
    customerName,
    customerEmail,
    customerPhone: customerPhone || "",
    message,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  inquiries.unshift(newInquiry);
  writeInquiries(inquiries);
  serverLog(`New inquiry submitted by: ${customerName} for ${productName || "General business"}`);
  res.status(201).json(newInquiry);
});

app.put("/api/inquiries/:id", (req, res) => {
  const inquiries = readInquiries();
  const { id } = req.params;
  const index = inquiries.findIndex(iq => iq.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Inquiry not found" });
  }

  inquiries[index].status = req.body.status;
  writeInquiries(inquiries);
  serverLog(`Inquiry ID ${id} status updated to: ${req.body.status}`);
  res.json(inquiries[index]);
});

// Analytics Dashboard Endpoint
app.get("/api/admin/analytics", (req, res) => {
  const products = readProducts();
  const inquiries = readInquiries();

  const divisionShares = {
    spices: 0,
    fashion: 0,
    accessories: 0,
    drinks: 0
  };

  products.forEach(p => {
    if (divisionShares[p.category] !== undefined) {
      divisionShares[p.category]++;
    }
  });

  const recentActivity = [
    `Loaded database with ${products.length} current products.`,
    `Discovered ${inquiries.filter(i => i.status === "pending").length} unanswered inquiries.`,
    `Ceylon Cinnamon quills have ${products.find(p=>p.id === "prod-1")?.stock || 0} active retail units in stock.`,
  ];

  res.json({
    totalInquiries: inquiries.length,
    pendingInquiries: inquiries.filter(i => i.status === "pending").length,
    divisionShares,
    totalProductsCount: products.length,
    recentActivity
  });
});

// AI Autocomplete and Marketing Copywriter Endpoint for Spices, Drinks, Fashion, Accessories
app.post("/api/admin/generate-product-details", async (req, res) => {
  const { name, category, keyHighlights } = req.body;
  if (!name || !category) {
    return res.status(400).json({ error: "Product Name and Category are required for AI copywriting" });
  }

  if (!ai) {
    // If Gemini key is missing, mock a beautiful copy
    serverLog("Gemini API Key missing. Providing mock AI copywriting.");
    const mockCopy = `Indulge in Niera's artisanal ${name}. Grown lovingly in the fertile soils of Sri Lanka, this exquisite offering brings out authentic flavor profiles with premium organic sustainability. Ideal for sophisticated global connoisseurs looking for direct trade purity. Highlights: ${keyHighlights || "Handcrafted, Ethically Sourced, Pure Taste"}`;
    return res.json({ description: mockCopy });
  }

  try {
    serverLog(`Generating AI details for product name: "${name}" under category: "${category}"`);
    const prompt = `You are a luxury branding copywriter for NIERA LIFE Pvt Ltd, a high-end Sri Lankan exporter of ethical luxury goods. 
    Category is: "${category}". 
    The product name is: "${name}". 
    Key features user listed are: "${keyHighlights || ""}".
    
    Please write a beautiful, elegant, and modern 3-sentence e-commerce description (highly engaging, appetizing/styling-oriented, and highlighting natural Sri Lankan origin) suitable for an upscale catalog. Keep it clean and do not include markdown bold tags inside the generated string.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const generatedText = response.text || "";
    res.json({ description: generatedText.trim() });
  } catch (error: any) {
    serverLog("Error generating AI content: " + error.message);
    res.status(500).json({ error: "AI writing failure. Please check server logs." });
  }
});

// AI Wellness & Curator Copilot API
app.post("/api/agent/suggest", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const products = readProducts();

  if (!ai) {
    // Elegant offline curator fallback
    const matched = products.filter(p => 
      p.name.toLowerCase().includes(prompt.toLowerCase()) || 
      p.category.toLowerCase().includes(prompt.toLowerCase()) ||
      p.description.toLowerCase().includes(prompt.toLowerCase())
    );
    const text = matched.length > 0 
      ? `Based on Sri Lanka's wellness heritage, I highly recommend our premium collection: ${matched.map(m=>m.name).join(", ")}. Let me know if you would like me to help you configure an inquiry or recipe suggestions around this!`
      : "I am Niera Life's AI Concierge. I can help you find Sri Lankan cinnamon recipes, suggest resort handloom sizes, match upcycled brass jewelry ensembles, or curate king coconut natural energy drink routines. What are you looking to experience?";
    return res.json({ text, matchedProducts: matched });
  }

  try {
    const listSummary = products.map(p => `- [id: ${p.id}, name: ${p.name}, category: ${p.category}, desc: ${p.description}]`).join("\n");

    const systemInstruction = `You are the Niera Life AI Wellness & Styling Concierge. Under NIERA LIFE Pvt Ltd, we offer 4 distinct high-end divisions:
    1. Niera Srilankan Spices (Ceylon cinnamon, black pepper) - represents heritage, healing, organic luxury.
    2. Niera Fashion - offers handwoven sarees, eco-friendly linen beach apparel.
    3. Niera Accessories - handcrafted jewelry (upcycled coconut shells, polished copper/brass) and handwoven reed totes.
    4. Niera Healthy/Energy Drinks - king coconut organic hydrations, golden turmeric longevity tonics.
    
    Always address the customer with polite warmth. Suggest which product from the catalog below matches their specific query best, or explain how NIERA's Sri Lankan artisan quality serves their health/lifestyle inquiry. Include culinary suggestions, sizing tips, or drink recipes where applicable.
    
    Catalog of available products:
    ${listSummary}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    serverLog("Error in AI Copilot: " + error.message);
    res.status(500).json({ error: "Interactive curator model error." });
  }
});

// Vite middleware and Asset setup and server activation
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    serverLog("Starting server in DEVELOPMENT mode with Vite Middleware.");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    serverLog("Starting server in PRODUCTION mode with compiled static assets.");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    serverLog(`NIERA LIFE server successfully booted, running live on http://localhost:${PORT}`);
  });
}

startServer();
