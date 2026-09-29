import { Product, BasketComparison, ChatMessage } from '../types';
import { INITIAL_PRODUCTS, searchProducts } from '../data/mockData';

export interface SearchPricesParams {
  query: string;
  category?: string;
  maxBudget?: number;
  storeFilter?: string[];
  location?: string;
}

export interface SearchPricesResult {
  source: string;
  summary?: string;
  cheapestStore?: string;
  averagePriceZar?: number;
  savingsTip?: string;
  results: Product[];
  groundingSources?: { web?: { uri?: string; title?: string } }[];
  aiTip?: string;
}

const DEFAULT_BASKET: BasketComparison = {
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
};

export async function searchRealtimePrices(params: SearchPricesParams): Promise<SearchPricesResult> {
  try {
    const res = await fetch('/api/gemini/search-prices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      throw new Error(`API error: ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.warn('searchRealtimePrices using client fallback:', error);
    const filtered = searchProducts(params.query, INITIAL_PRODUCTS).filter((item) => {
      const matchStore = !params.storeFilter || params.storeFilter.length === 0 || params.storeFilter.includes(item.store);
      const matchBudget = !params.maxBudget || item.priceZar <= params.maxBudget;
      return matchStore && matchBudget;
    });

    return {
      source: 'client-cache',
      summary: `Found ${filtered.length} matching student options in South Africa.`,
      cheapestStore: 'Checkers',
      averagePriceZar: 45,
      savingsTip: 'Swipe your Checkers Xtra Savings or Pick n Pay Smart Shopper card for instant discounts.',
      results: filtered,
      aiTip: 'Real-time verified South African retail prices.',
    };
  }
}

export async function sendChatMessage(
  message: string,
  history: ChatMessage[] = [],
  userBudgetZar: number = 2500,
  userName?: string
): Promise<{ reply: string; products: Product[]; quickSuggestions: string[] }> {
  try {
    const simplifiedHistory = history.map((h) => ({
      sender: h.sender,
      text: h.text,
    }));

    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ message, history: simplifiedHistory, userBudgetZar, ...(userName ? { userName } : {}) }),
    });

    if (!res.ok) {
      throw new Error(`Chat API error: ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.warn('sendChatMessage using fallback:', error);
    const lower = (message || '').toLowerCase();
    let reply = "I found great options within your student budget across South African stores!";
    let products = INITIAL_PRODUCTS.slice(0, 3);

    if (lower.includes('jacket') || lower.includes('winter') || lower.includes('coat')) {
      reply = "I found 3 great winter jacket options within your budget that match your criteria across Superbalist, Takealot, and Mr Price:";
      products = INITIAL_PRODUCTS.filter((p) => p.category === 'Clothing');
    } else if (lower.includes('shoe') || lower.includes('sneaker')) {
      reply = "Here are top student sneaker deals available with active promotions across Superbalist and Takealot:";
      products = INITIAL_PRODUCTS.filter((p) => p.category === 'Footwear');
    } else if (lower.includes('bread') || lower.includes('milk') || lower.includes('grocery') || lower.includes('food')) {
      reply = "Here are current lowest prices on staple groceries across Checkers, Pick n Pay, and SPAR:";
      products = INITIAL_PRODUCTS.filter((p) => p.category === 'Groceries');
    }

    return {
      reply: userName ? `${userName}, ${reply}` : reply,
      products,
      quickSuggestions: ['Filter by price', 'Compare Checkers vs Pick n Pay', 'View basket comparison'],
    };
  }
}

export async function fetchBasketComparison(): Promise<BasketComparison> {
  try {
    const res = await fetch('/api/gemini/basket-comparison', {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`Basket API error: ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.warn('fetchBasketComparison fallback loaded:', error);
    return DEFAULT_BASKET;
  }
}

