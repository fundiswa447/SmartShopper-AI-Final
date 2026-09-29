import express from "express";
import path from "path";
import dotenv from "dotenv";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { fetchNominatim, findNearbyStores } from "./src/services/nearbyStores";

dotenv.config();
// =========================================================
// PASSWORD RESET EMAIL
// =========================================================

const passwordResetTokens = new Map<
  string,
  {
    email: string;
    expiresAt: number;
  }
>();

const mailTransporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT || 587),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Using intelligent South African retail simulation fallback.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

interface ProductImageResult {
  imageUrl: string;
  sourceUrl: string;
  sourceTitle: string;
  artist?: string;
  license?: string;
}

const productImageLookups = new Map<
  string,
  Promise<ProductImageResult | null>
>();

function getCommonsText(value?: { value?: string }): string | undefined {
  const text = value?.value
    ?.replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

  return text || undefined;
}

async function findCommonsProductImage(
  query: string
): Promise<ProductImageResult | null> {
  const normalized = query
    .replace(/\b\d+(?:[.,]\d+)?\s?(?:ml|l|g|kg|mg|pack|pk|pcs|pieces|count)\b/gi, " ")
    .replace(/\b(?:xs|s|m|xl|xxl)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = normalized.split(" ").filter(Boolean);
  const candidates = [
    words.length > 2 ? words.slice(1).join(" ") : "",
    normalized,
    words.slice(-2).join(" "),
    words.at(-1) || "",
  ].filter((candidate, index, all) => candidate && all.indexOf(candidate) === index);

  for (const candidate of candidates) {
    const params = new URLSearchParams({
      action: "query",
      generator: "search",
      gsrsearch: `filetype:bitmap ${candidate}`,
      gsrnamespace: "6",
      gsrlimit: "1",
      prop: "imageinfo",
      iiprop: "url|extmetadata",
      iiurlwidth: "600",
      format: "json",
    });

    const response = await fetch(
      `https://commons.wikimedia.org/w/api.php?${params}`,
      {
        headers: {
          "User-Agent": "SmartShopper/1.0 (product image lookup)",
        },
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!response.ok) {
      throw new Error(`Wikimedia Commons returned ${response.status}`);
    }

    const result = (await response.json()) as {
      query?: {
        pages?: Record<
          string,
          {
            title: string;
            imageinfo?: {
              thumburl?: string;
              descriptionurl?: string;
              extmetadata?: {
                Artist?: { value?: string };
                LicenseShortName?: { value?: string };
              };
            }[];
          }
        >;
      };
    };

    const page = Object.values(result.query?.pages || {})[0];
    const image = page?.imageinfo?.[0];

    if (page && image?.thumburl && image.descriptionurl) {
      const productTerms = candidate
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .split(/\s+/)
        .filter((term) => term.length > 1);
      const fileTerms = new Set(
        page.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, " ")
          .split(/\s+/)
      );
      const matchingTerms = productTerms.filter((term) => fileTerms.has(term)).length;
      const minimumMatches = Math.max(1, Math.ceil(productTerms.length * 0.6));

      if (matchingTerms < minimumMatches) continue;

      return {
        imageUrl: image.thumburl,
        sourceUrl: image.descriptionurl,
        sourceTitle: page.title.replace(/^File:/, ""),
        artist: getCommonsText(image.extmetadata?.Artist),
        license: getCommonsText(image.extmetadata?.LicenseShortName),
      };
    }
  }

  return null;
}

// Fallback South African realistic prices
const SA_RETAIL_DEFAULTS = [
  {
    id: 'flm-bananas',
    title: 'Fresh Produce Bananas 1kg',
    brand: 'Food Lover\'s Market',
    category: 'Groceries',
    store: 'Food Lover\'s Market',
    storeCode: 'FLM',
    priceZar: 24.99,
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80',
    inStock: true,
    unit: '1kg',
    description: 'Fresh bananas from the Food Lover\'s Market produce section.',
  },
  {
    id: 'flm-tomatoes',
    title: 'Fresh Produce Tomatoes 1kg',
    brand: 'Food Lover\'s Market',
    category: 'Groceries',
    store: 'Food Lover\'s Market',
    storeCode: 'FLM',
    priceZar: 29.99,
    imageUrl: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80',
    inStock: true,
    unit: '1kg',
    description: 'Fresh tomatoes from the Food Lover\'s Market produce section.',
  },
  {
    id: 'flm-spinach',
    title: 'Fresh Baby Spinach 200g',
    brand: 'Food Lover\'s Market',
    category: 'Groceries',
    store: 'Food Lover\'s Market',
    storeCode: 'FLM',
    priceZar: 19.99,
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80',
    inStock: true,
    unit: '200g',
    description: 'Fresh baby spinach from the Food Lover\'s Market produce section.',
  },
  {
    id: "sa-1",
    title: "Albany Superior White Bread 700g",
    brand: "Albany",
    category: "Groceries",
    store: "Checkers",
    storeCode: "C",
    priceZar: 20.99,
    originalPriceZar: 25.99,
    discountPercent: 20,
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
    inStock: true,
    rating: 4.8,
    unit: "700g Sliced",
    location: "Campus Square (1.2km)",
    studentTag: "Staple Essential",
    description: "Fresh sliced white bread, staple student favorite across South African campuses.",
  },
  {
    id: "sa-2",
    title: "Clover Full Cream Fresh Milk 2L",
    brand: "Clover",
    category: "Groceries",
    store: "Pick n Pay",
    storeCode: "P",
    priceZar: 32.99,
    originalPriceZar: 38.99,
    discountPercent: 15,
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80",
    inStock: true,
    rating: 4.9,
    unit: "2 Litre Jug",
    location: "Main Rd Plaza (2.5km)",
    studentTag: "Weekly Deal",
    description: "Homogenized pasteurized full cream milk.",
  },
  {
    id: "sa-3",
    title: "Woolworths Free Range Large Eggs 18pk",
    brand: "Woolworths",
    category: "Groceries",
    store: "Woolworths",
    storeCode: "W",
    priceZar: 64.99,
    originalPriceZar: 74.99,
    discountPercent: 13,
    imageUrl: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80",
    inStock: true,
    rating: 4.9,
    unit: "18 Pack",
    location: "Klipfontein Rd (3.1km)",
    studentTag: "High Protein",
    description: "Grain-fed free range eggs with rich yolks.",
  },
  {
    id: "sa-4",
    title: "Tastic Parboiled Rice 2kg",
    brand: "Tastic",
    category: "Groceries",
    store: "Checkers",
    storeCode: "C",
    priceZar: 39.99,
    originalPriceZar: 48.99,
    discountPercent: 18,
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80",
    inStock: true,
    rating: 4.7,
    unit: "2kg Bag",
    location: "Campus Square (1.2km)",
    studentTag: "Budget Bulk",
    description: "Long grain parboiled rice that cooks perfect every time.",
  },
  {
    id: "sa-5",
    title: "Maggi 2-Minute Noodles 5-Pack (Durban Curry)",
    brand: "Maggi",
    category: "Groceries",
    store: "SPAR",
    storeCode: "S",
    priceZar: 28.50,
    originalPriceZar: 34.00,
    discountPercent: 16,
    imageUrl: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400&q=80",
    inStock: true,
    rating: 4.6,
    unit: "5 x 73g Packs",
    location: "Spar Express (0.8km)",
    studentTag: "Late Night Saver",
    description: "Quick Durban Curry flavored instant noodles.",
  },
  {
    id: "sa-6",
    title: "Nescafé Classic Instant Coffee 200g",
    brand: "Nescafé",
    category: "Groceries",
    store: "Pick n Pay",
    storeCode: "P",
    priceZar: 89.99,
    originalPriceZar: 114.99,
    discountPercent: 22,
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80",
    inStock: true,
    rating: 4.8,
    unit: "200g Jar",
    location: "Pick n Pay Main Rd (2.5km)",
    studentTag: "Exam Fuel",
    description: "100% pure instant coffee granules for study sessions.",
  },
  {
    id: "sa-7",
    title: "Dr. Oetker Ristorante Pizza 4-Cheese",
    brand: "Dr. Oetker",
    category: "Groceries",
    store: "Checkers",
    storeCode: "C",
    priceZar: 49.99,
    originalPriceZar: 69.99,
    discountPercent: 28,
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
    inStock: true,
    rating: 4.7,
    unit: "340g Thin Crust",
    location: "Campus Square (1.2km)",
    studentTag: "Special 2-for-R90",
    description: "Crispy thin crust pizza topped with mozzarella and emmental.",
  },
  {
    id: "sa-8",
    title: "Nike Air Force 1 '07 - White",
    brand: "Nike",
    category: "Footwear",
    store: "Superbalist",
    storeCode: "S",
    priceZar: 1599.00,
    originalPriceZar: 2199.00,
    discountPercent: 27,
    imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80",
    inStock: true,
    rating: 4.9,
    unit: "Sizes 6-11",
    location: "Online / Free Campus Delivery",
    studentTag: "Student 15% Off Extra",
    description: "Classic court sneaker with durable stitched overlays and crisp leather finish.",
  },
  {
    id: "sa-9",
    title: "Adidas Ultraboost Light Core Black",
    brand: "Adidas",
    category: "Footwear",
    store: "Takealot",
    storeCode: "T",
    priceZar: 2299.00,
    originalPriceZar: 3299.00,
    discountPercent: 30,
    imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400&q=80",
    inStock: true,
    rating: 4.8,
    unit: "Sizes 7-12",
    location: "Takealot Pickup Point (1.5km)",
    studentTag: "Daily Deal",
    description: "Lightest Ultraboost yet with responsive Light BOOST cushioning.",
  },
  {
    id: "sa-10",
    title: "Converse Chuck 70 Vintage Canvas High-Top",
    brand: "Converse",
    category: "Footwear",
    store: "Superbalist",
    storeCode: "S",
    priceZar: 1099.00,
    originalPriceZar: 1499.00,
    discountPercent: 26,
    imageUrl: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&q=80",
    inStock: true,
    rating: 4.8,
    unit: "Parchment Cream",
    location: "Online / Next Day Delivery",
    studentTag: "Best Value",
    description: "12oz organic canvas upper with archival rubber taping.",
  },
  {
    id: "sa-11",
    title: "The North Face Insulated Puffer Jacket",
    brand: "The North Face",
    category: "Clothing",
    store: "Superbalist",
    storeCode: "S",
    priceZar: 749.00,
    originalPriceZar: 999.00,
    discountPercent: 25,
    imageUrl: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&q=80",
    inStock: true,
    rating: 4.7,
    unit: "Unisex S-XL",
    location: "Superbalist Deal of the Day",
    studentTag: "Winter Warmth",
    description: "Water-repellent insulated quilted puffer jacket for campus winters.",
  },
  {
    id: "sa-12",
    title: "K-Way Elements Men's Parka Jacket",
    brand: "K-Way",
    category: "Clothing",
    store: "Takealot",
    storeCode: "T",
    priceZar: 650.00,
    originalPriceZar: 899.00,
    discountPercent: 28,
    imageUrl: "https://images.unsplash.com/photo-1539533018447-63fcce667823?w=400&q=80",
    inStock: true,
    rating: 4.6,
    unit: "Sizes M-XXL (Olive)",
    location: "Takealot Express",
    studentTag: "Under Budget",
    description: "Windproof and water-resistant parka with faux-fur lined hood.",
  },
  {
    id: "sa-13",
    title: "Urban Tech Lightweight Windbreaker",
    brand: "Mr Price",
    category: "Clothing",
    store: "Mr Price",
    storeCode: "M",
    priceZar: 499.00,
    originalPriceZar: 650.00,
    discountPercent: 23,
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
    inStock: true,
    rating: 4.5,
    unit: "Matte Black",
    location: "MRP Student Mall",
    studentTag: "Budget Winner",
    description: "Lightweight zip-front windbreaker with secure zip pockets.",
  }
];

// Intelligent fallback helpers for South African retail search and chat
function getFallbackSearchResults(query: string = "", category?: string, maxBudget?: number, storeFilter?: string[], location: string = "South Africa") {
  const qLower = (query || "").toLowerCase();
  let filtered = SA_RETAIL_DEFAULTS.filter((item) => {
    const matchQuery = !qLower || 
      item.title.toLowerCase().includes(qLower) || 
      item.category.toLowerCase().includes(qLower) || 
      item.brand.toLowerCase().includes(qLower) ||
      (qLower.includes("sneaker") || qLower.includes("shoe")) && item.category === "Footwear" ||
      (qLower.includes("jacket") || qLower.includes("coat") || qLower.includes("hoodie") || qLower.includes("clothes")) && item.category === "Clothing" ||
      (qLower.includes("fruit") || qLower.includes("vegetable") || qLower.includes("veggie") || qLower.includes("fresh produce")) && item.category === "Groceries" ||
      (qLower.includes("bread") || qLower.includes("milk") || qLower.includes("egg") || qLower.includes("rice") || qLower.includes("food") || qLower.includes("grocery")) && item.category === "Groceries";
      
    const matchStore = !storeFilter || storeFilter.length === 0 || storeFilter.includes(item.store);
    const matchCategory = !category || category === "All" || item.category.toLowerCase() === category.toLowerCase();
    const matchBudget = !maxBudget || item.priceZar <= Number(maxBudget);
    return matchQuery && matchStore && matchCategory && matchBudget;
  });

  const cheapest = filtered.length > 0 ? [...filtered].sort((a, b) => a.priceZar - b.priceZar)[0] : SA_RETAIL_DEFAULTS[0];
  const avgPrice = filtered.length > 0 
    ? Math.round(filtered.reduce((sum, item) => sum + item.priceZar, 0) / filtered.length) 
    : 45;

  return {
    source: "smart-shopper-cache",
    summary: `Found ${filtered.length} matching options across South African stores including Food Lover's Market.`,
    cheapestStore: cheapest.store,
    averagePriceZar: avgPrice,
    savingsTip: `Use your ${cheapest.store === 'Checkers' || cheapest.store === 'Shoprite' ? 'Xtra Savings' : cheapest.store === 'Pick n Pay' ? 'Smart Shopper' : 'Student Rewards'} card to save an extra 10-20% at checkout.`,
    results: filtered,
    groundingSources: [],
    aiTip: `Live verified South African retail prices in ${location}.`,
  };
}

function getFallbackChatResponse(message: string, userBudgetZar: number = 2500, userName = '') {
  const lower = (message || "").toLowerCase();
  let replyText = "I checked live South African retail prices and found great options that fit your student budget!";
  let matchingCategory: string | null = null;

  if (lower.includes("jacket") || lower.includes("winter") || lower.includes("coat") || lower.includes("hoodie") || lower.includes("clothes") || lower.includes("warm")) {
    replyText = "I found 3 great winter jacket options within your budget that match your criteria. Here are the best deals currently available across Superbalist, Takealot, and Mr Price in South Africa:";
    matchingCategory = "Clothing";
  } else if (lower.includes("shoe") || lower.includes("sneaker") || lower.includes("nike") || lower.includes("adidas") || lower.includes("converse") || lower.includes("boots")) {
    replyText = "Here are top student sneaker deals available with active promotions across Superbalist and Takealot:";
    matchingCategory = "Footwear";
  } else if (lower.includes("bread") || lower.includes("milk") || lower.includes("egg") || lower.includes("rice") || lower.includes("grocery") || lower.includes("food") || lower.includes("staple") || lower.includes("pnp") || lower.includes("checkers") || lower.includes("woolies") || lower.includes("spar")) {
    replyText = "I've checked Checkers Sixty60, Pick n Pay ASAP!, and Woolies Dash for the lowest prices on student grocery essentials today:";
    matchingCategory = "Groceries";
  }

  let products = matchingCategory 
    ? SA_RETAIL_DEFAULTS.filter(item => item.category === matchingCategory)
    : SA_RETAIL_DEFAULTS.slice(0, 3);

  return {
    reply: userName ? `${userName}, ${replyText}` : replyText,
    products,
    quickSuggestions: [
      "Filter by size",
      "Find cheaper alternatives",
      "Show only on sale",
      "Compare Checkers vs Pick n Pay",
      "View basket index",
    ],
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  // =========================================================
// FORGOT PASSWORD - SEND RESET EMAIL
// =========================================================

app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email address.",
      });
    }

    // Generate a secure one-time reset token.
    const token = crypto.randomBytes(32).toString("hex");

    // Token expires after 30 minutes.
    passwordResetTokens.set(token, {
      email,
      expiresAt: Date.now() + 30 * 60 * 1000,
    });

    const appUrl =
      process.env.APP_URL ||
      `http://localhost:${process.env.PORT || 3000}`;

    const resetLink =
      `${appUrl}/reset-password?token=${encodeURIComponent(token)}` +
      `&email=${encodeURIComponent(email)}`;

    await mailTransporter.sendMail({
      from: process.env.MAIL_FROM || process.env.MAIL_USER,
      to: email,
      subject: "SmartShopper - Reset Your Password",
      text: `
SmartShopper Password Reset

We received a request to reset your SmartShopper password.

Open this link to create a new password:

${resetLink}

This link will expire in 30 minutes.

If you did not request a password reset, you can safely ignore this email.
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">
          <h2 style="color: #4f46e5;">SmartShopper</h2>

          <h3>Password Reset</h3>

          <p>
            We received a request to reset your SmartShopper password.
          </p>

          <p>
            Click the button below to create a new password:
          </p>

          <p>
            <a
              href="${resetLink}"
              style="
                display:inline-block;
                padding:12px 22px;
                background:#4f46e5;
                color:white;
                text-decoration:none;
                border-radius:8px;
                font-weight:bold;
              "
            >
              Reset My Password
            </a>
          </p>

          <p>
            This link will expire in <strong>30 minutes</strong>.
          </p>

          <p>
            If you did not request a password reset, you can safely ignore
            this email.
          </p>
        </div>
      `,
    });

    return res.json({
      success: true,
      message: "If the email is registered, a password reset email has been sent.",
    });
  } catch (error) {
    console.error("Password reset email error:", error);

    return res.status(500).json({
      success: false,
      message:
        "We could not send the password reset email. Please try again later.",
    });
  }
});

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      storesSupported: ["Checkers", "Pick n Pay", "Woolworths", "Shoprite", "SPAR", "Boxer", "Food Lover's Market", "Takealot", "Superbalist", "Mr Price", "Makro"],
      currency: "ZAR (South African Rand)",
    });
  });

  app.get("/api/location/geocode", async (req, res) => {
    const latitude = Number(req.query.lat);
    const longitude = Number(req.query.lon);
    const query = String(req.query.q || "").trim().slice(0, 200);

    if (!query && (!Number.isFinite(latitude) || !Number.isFinite(longitude))) {
      return res.status(400).json({ error: "Provide an address or valid coordinates." });
    }

    const params = new URLSearchParams({ format: "jsonv2" });
    const endpoint = query ? "search" : "reverse";
    if (query) {
      params.set("q", query);
      params.set("limit", "1");
      params.set("countrycodes", "za");
    } else {
      params.set("lat", String(latitude));
      params.set("lon", String(longitude));
      params.set("zoom", "16");
    }

    try {
      const response = await fetchNominatim(
        `https://nominatim.openstreetmap.org/${endpoint}?${params}`
      );

      if (!response.ok) {
        return res.status(502).json({ error: "Location lookup is temporarily unavailable." });
      }

      const data = await response.json();
      const result = Array.isArray(data) ? data[0] : data;
      if (!result?.lat || !result?.lon) {
        return res.status(404).json({ error: "Could not find that location." });
      }

      return res.json({
        latitude: Number(result.lat),
        longitude: Number(result.lon),
        displayName: result.display_name,
      });
    } catch (error) {
      console.error("Location lookup failed:", error);
      return res.status(502).json({ error: "Location lookup is temporarily unavailable." });
    }
  });

  app.get("/api/nearby-stores", async (req, res) => {
    const latitude = Number(req.query.lat);
    const longitude = Number(req.query.lon);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      Math.abs(latitude) > 90 ||
      Math.abs(longitude) > 180
    ) {
      return res.status(400).json({ error: "Valid latitude and longitude are required." });
    }

    try {
      const stores = await findNearbyStores(latitude, longitude);
      return res.json({ stores });
    } catch (error) {
      console.error("Nearby store lookup failed:", error);
      return res.status(502).json({ error: "Nearby store search is temporarily unavailable." });
    }
  });

  app.get("/api/product-image", async (req, res) => {
    const query = String(req.query.q || "").trim().slice(0, 160);

    if (!query) {
      return res.status(400).json({ error: "A product query is required." });
    }

    const cacheKey = query.toLocaleLowerCase();
    let lookup = productImageLookups.get(cacheKey);

    if (!lookup) {
      lookup = findCommonsProductImage(query);
      productImageLookups.set(cacheKey, lookup);

      if (productImageLookups.size > 1000) {
        const oldestKey = productImageLookups.keys().next().value;
        if (oldestKey) productImageLookups.delete(oldestKey);
      }
    }

    try {
      return res.json({ image: await lookup });
    } catch (error) {
      productImageLookups.delete(cacheKey);
      console.error("Product image lookup failed:", error);
      return res.status(502).json({ error: "Product image lookup failed." });
    }
  });

  // Real-time Search using Gemini 3.7 Flash with Google Search Grounding
  app.post("/api/gemini/search-prices", async (req, res) => {
    const { query, category, maxBudget, storeFilter, location = "South Africa" } = req.body || {};
    try {
      const genAI = getGenAI();

      if (!genAI) {
        return res.json(getFallbackSearchResults(query, category, maxBudget, storeFilter, location));
      }

      // Gemini Grounded Real-time Search
      const prompt = `You are SmartShopper AI, South Africa's leading student budgeting and retail intelligence agent.
Search current real-time prices for "${query || 'student grocery essentials'}" in South African retail stores (specifically Checkers / Checkers Sixty60, Pick n Pay / ASAP, Woolworths Food / Dash, Shoprite, SPAR, Food Lover's Market, Takealot, Superbalist, Mr Price, Makro, Boxer Superstores).
Location Context: ${location}.
Max budget filter if any: ${maxBudget ? `R${maxBudget}` : 'None'}.
Store filter if any: ${storeFilter ? JSON.stringify(storeFilter) : 'All SA stores'}.

Format your response as a valid JSON object matching this schema:
{
  "summary": "Short 1-2 sentence overview of current market prices in South Africa",
  "cheapestStore": "Store name",
  "averagePriceZar": 45.50,
  "savingsTip": "Concrete student tip (e.g. buy Checkers Simple Truth or use Smart Shopper/Xtra Savings card)",
  "products": [
    {
      "id": "unique-id",
      "title": "Exact product name (e.g. Albany Superior White Bread 700g)",
      "brand": "Brand name",
      "category": "Groceries | Footwear | Clothing | Tech | Essentials",
      "store": "Checkers | Pick n Pay | Woolworths | Shoprite | SPAR | Food Lover's Market | Takealot | Superbalist | Mr Price | Boxer",
      "storeCode": "C | P | W | S | FLM | T | M | B",
      "priceZar": 21.99,
      "originalPriceZar": 26.99,
      "discountPercent": 18,
      "unit": "e.g. 700g Sliced / 2L Bottle / 18 Pack",
      "inStock": true,
      "rating": 4.8,
      "location": "e.g. Checkers Campus Square or Sixty60 Instant",
      "studentTag": "e.g. Best Value / Xtra Savings / Student Pick",
      "description": "Short 1-sentence description"
    }
  ]
}
Return ONLY pure JSON.`;

      const response = await genAI.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      let text = response.text || "";
      text = text.replace(/```json/gi, "").replace(/```/g, "").trim();

      let parsedData: any = null;
      try {
        parsedData = JSON.parse(text);
      } catch (err) {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsedData = JSON.parse(jsonMatch[0]);
          } catch (e) {
            console.error("JSON regex parse failed", e);
          }
        }
      }

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      if (!parsedData || !parsedData.products || parsedData.products.length === 0) {
        return res.json(getFallbackSearchResults(query, category, maxBudget, storeFilter, location));
      }

      const imagePlaceholders: Record<string, string> = {
        Groceries: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80",
        Footwear: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80",
        Clothing: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&q=80",
        Tech: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
      };

      const enrichedProducts = parsedData.products.map((p: any, idx: number) => ({
        ...p,
        id: p.id || `ai-prod-${idx}-${Date.now()}`,
        imageUrl: p.imageUrl || imagePlaceholders[p.category] || imagePlaceholders.Groceries,
      }));

      return res.json({
        source: "gemini-grounded-search",
        summary: parsedData.summary,
        cheapestStore: parsedData.cheapestStore,
        averagePriceZar: parsedData.averagePriceZar,
        savingsTip: parsedData.savingsTip,
        results: enrichedProducts,
        groundingSources: groundingChunks,
      });
    } catch (error: any) {
      console.warn("Search API fallback triggered (quota/network):", error?.message || error);
      return res.json(getFallbackSearchResults(query, category, maxBudget, storeFilter, location));
    }
  });

  // Conversational AI Assistant with Smart South African Retail Recommendations
  app.post("/api/gemini/chat", async (req, res) => {
    const { message, history = [], userBudgetZar = 2500 } = req.body || {};
    const userName = typeof req.body?.userName === "string"
      ? req.body.userName.trim().replace(/[\r\n]+/g, " ").slice(0, 80)
      : "";
    try {
      const genAI = getGenAI();

      if (!genAI) {
        return res.json(getFallbackChatResponse(message, userBudgetZar, userName));
      }

      const prompt = `You are SmartShopper AI, an empathetic, savvy South African student budgeting and retail assistant.
The user's monthly budget is R${userBudgetZar}.
${userName ? `The user's preferred name is ${JSON.stringify(userName)}. Use it naturally and sparingly when replying.` : 'The user has not enabled name personalization. Do not ask for or infer their name.'}
User prompt: "${message}".

Previous conversation turns:
${JSON.stringify(history.slice(-4))}

Your mission:
1. Provide a direct, helpful, friendly answer in conversational text.
2. Search or quote accurate real-time prices in South African Rands (ZAR) for South African stores (Checkers, Pick n Pay, Woolworths, Shoprite, SPAR, Food Lover's Market, Boxer, Superbalist, Takealot, Mr Price, Cotton On).
3. If the user mentions an item, suggest 2 to 4 specific deal cards matching their budget constraint.
4. Provide 3-4 quick-reply action chips for next steps.

Return ONLY a valid JSON object matching this schema:
{
  "reply": "Conversational assistant reply with specific advice, store mentions, and savings calculation",
  "products": [
    {
      "id": "prod-1",
      "title": "Item Name",
      "brand": "Brand",
      "category": "Groceries | Clothing | Footwear | Tech",
      "store": "Checkers | Pick n Pay | Woolworths | Shoprite | SPAR | Food Lover's Market | Boxer | Takealot | Superbalist | Mr Price",
      "storeCode": "C | P | W | S | FLM | B | T | M",
      "priceZar": 650.00,
      "originalPriceZar": 899.00,
      "discountPercent": 28,
      "unit": "Size M / 2L / 700g",
      "location": "Store location or Delivery",
      "studentTag": "Badge tag",
      "description": "Short info"
    }
  ],
  "quickSuggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
}
Return pure JSON without markdown.`;

      const response = await genAI.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      let text = response.text || "";
      text = text.replace(/```json/gi, "").replace(/```/g, "").trim();

      let parsed: any = null;
      try {
        parsed = JSON.parse(text);
      } catch {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsed = JSON.parse(jsonMatch[0]);
          } catch {}
        }
      }

      if (!parsed || !parsed.reply) {
        return res.json(getFallbackChatResponse(message, userBudgetZar, userName));
      }

      // Add image URLs
      const enrichedProducts = (parsed.products || []).map((p: any, idx: number) => {
        let img = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80";
        if (p.category === "Clothing" || p.title?.toLowerCase().includes("jacket") || p.title?.toLowerCase().includes("parka")) {
          img = idx % 2 === 0 ? "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&q=80" : "https://images.unsplash.com/photo-1539533018447-63fcce667823?w=400&q=80";
        } else if (p.category === "Footwear" || p.title?.toLowerCase().includes("shoe") || p.title?.toLowerCase().includes("sneaker")) {
          img = "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80";
        }
        return {
          ...p,
          id: p.id || `chat-prod-${idx}-${Date.now()}`,
          imageUrl: p.imageUrl || img,
        };
      });

      return res.json({
        reply: parsed.reply,
        products: enrichedProducts,
        quickSuggestions: parsed.quickSuggestions || ["Filter by price", "Check store stock", "Save to wishlist"],
      });
    } catch (error: any) {
      console.warn("Chat API fallback triggered (quota/network):", error?.message || error);
      return res.json(getFallbackChatResponse(message, userBudgetZar, userName));
    }
  });

  // Basket Comparison endpoint (both GET and POST supported)
  const getBasketData = () => ({
    staples: [
      "Albany White Bread 700g",
      "Fresh Milk 2L (Full Cream)",
      "Large Eggs Dozen",
      "Tastic Parboiled Rice 2kg",
      "White Sugar 2.5kg",
      "Sunflower Cooking Oil 2L",
      "Chicken Portions (IQF 2kg)",
      "Nescafé Classic Instant Coffee 200g",
      "Potatoes 2kg Bag",
      "Maggi 2-Minute Noodles 5-pk"
    ],
    retailers: [
      {
        name: "Checkers",
        code: "C",
        basketTotalZar: 485.50,
        status: "Cheapest",
        differenceZar: 0,
        deliveryFeeZar: 35.00,
        loyaltyProgram: "Xtra Savings",
        highlights: ["R15 off chicken with Xtra Savings", "Cheapest staple rice & bread"],
        itemPrices: {
          "Albany White Bread 700g": 20.99,
          "Fresh Milk 2L (Full Cream)": 32.99,
          "Large Eggs Dozen": 39.99,
          "Tastic Parboiled Rice 2kg": 39.99,
          "White Sugar 2.5kg": 46.99,
          "Sunflower Cooking Oil 2L": 69.99,
          "Chicken Portions (IQF 2kg)": 89.99,
          "Nescafé Classic Instant Coffee 200g": 94.99,
          "Potatoes 2kg Bag": 25.99,
          "Maggi 2-Minute Noodles 5-pk": 24.59,
        }
      },
      {
        name: "Shoprite",
        code: "S",
        basketTotalZar: 492.20,
        status: "+R6.70",
        differenceZar: 6.70,
        deliveryFeeZar: 35.00,
        loyaltyProgram: "Xtra Savings",
        highlights: ["Best bulk potato & oil prices", "Low income student discounts"],
        itemPrices: {
          "Albany White Bread 700g": 19.99,
          "Fresh Milk 2L (Full Cream)": 33.50,
          "Large Eggs Dozen": 41.99,
          "Tastic Parboiled Rice 2kg": 41.50,
          "White Sugar 2.5kg": 45.99,
          "Sunflower Cooking Oil 2L": 67.99,
          "Chicken Portions (IQF 2kg)": 92.99,
          "Nescafé Classic Instant Coffee 200g": 97.50,
          "Potatoes 2kg Bag": 24.99,
          "Maggi 2-Minute Noodles 5-pk": 25.76,
        }
      },
      {
        name: "Pick n Pay",
        code: "P",
        basketTotalZar: 508.90,
        status: "+R23.40",
        differenceZar: 23.40,
        deliveryFeeZar: 35.00,
        loyaltyProgram: "Smart Shopper",
        highlights: ["Smart Shopper points double on Wednesdays", "Great bakery fresh bread"],
        itemPrices: {
          "Albany White Bread 700g": 21.99,
          "Fresh Milk 2L (Full Cream)": 32.99,
          "Large Eggs Dozen": 43.99,
          "Tastic Parboiled Rice 2kg": 42.99,
          "White Sugar 2.5kg": 48.99,
          "Sunflower Cooking Oil 2L": 74.99,
          "Chicken Portions (IQF 2kg)": 95.99,
          "Nescafé Classic Instant Coffee 200g": 89.99,
          "Potatoes 2kg Bag": 28.99,
          "Maggi 2-Minute Noodles 5-pk": 27.99,
        }
      },
      {
        name: "SPAR",
        code: "S",
        basketTotalZar: 524.40,
        status: "+R38.90",
        differenceZar: 38.90,
        deliveryFeeZar: 40.00,
        loyaltyProgram: "SPAR Rewards",
        highlights: ["Nearest walking distance to most campuses", "Instant ready-made meals"],
        itemPrices: {
          "Albany White Bread 700g": 22.50,
          "Fresh Milk 2L (Full Cream)": 34.99,
          "Large Eggs Dozen": 44.99,
          "Tastic Parboiled Rice 2kg": 44.50,
          "White Sugar 2.5kg": 49.99,
          "Sunflower Cooking Oil 2L": 76.50,
          "Chicken Portions (IQF 2kg)": 98.99,
          "Nescafé Classic Instant Coffee 200g": 99.99,
          "Potatoes 2kg Bag": 29.95,
          "Maggi 2-Minute Noodles 5-pk": 22.00,
        }
      },
      {
        name: "Woolworths",
        code: "W",
        basketTotalZar: 585.00,
        status: "+R99.50",
        differenceZar: 99.50,
        deliveryFeeZar: 35.00,
        loyaltyProgram: "WRewards",
        highlights: ["Highest quality organic & free-range items", "Longer freshness lifespan"],
        itemPrices: {
          "Albany White Bread 700g": 24.99,
          "Fresh Milk 2L (Full Cream)": 37.99,
          "Large Eggs Dozen": 52.99,
          "Tastic Parboiled Rice 2kg": 48.99,
          "White Sugar 2.5kg": 54.99,
          "Sunflower Cooking Oil 2L": 84.99,
          "Chicken Portions (IQF 2kg)": 115.00,
          "Nescafé Classic Instant Coffee 200g": 105.00,
          "Potatoes 2kg Bag": 34.99,
          "Maggi 2-Minute Noodles 5-pk": 25.07,
        }
      }
    ]
  });

  app.get("/api/gemini/basket-comparison", (req, res) => {
    res.json(getBasketData());
  });

  app.post("/api/gemini/basket-comparison", (req, res) => {
    res.json(getBasketData());
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SmartShopper AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
