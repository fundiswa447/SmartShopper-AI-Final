export type Currency = 'ZAR' | 'USD';

export type ScreenId = 'home' | 'dashboard' | 'shoppinglist' | 'assistant' | 'search' | 'pricewatch' | 'profile' | 'history';

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: 'Groceries' | 'Footwear' | 'Clothing' | 'Tech' | 'Essentials' | 'Snacks' | 'Electronics' | 'Cosmetics';
  store: 'Checkers' | 'Pick n Pay' | 'Woolworths' | 'Shoprite' | 'SPAR' | 'Takealot' | 'Superbalist' | 'Mr Price' | 'Makro' | 'Boxer' | 'Food Lover\'s Market' | 'Jet' | 'Ackermans' | 'PEP' | 'Cotton On' | 'Game';
  storeCode: 'C' | 'P' | 'W' | 'S' | 'SH' | 'SP' | 'T' | 'SB' | 'MR' | 'M' | 'B' | 'FLM' | 'J' | 'A' | 'PE' | 'CO' | 'G';
  priceZar: number;
  originalPriceZar?: number;
  discountPercent?: number;
  imageUrl?: string;
  inStock: boolean;
  rating?: number;
  unit?: string;
  location?: string;
  distanceKm?: number;
  studentTag?: string;
  description?: string;
  subcategory?: string;
  isGreatValue?: boolean;
  tracked?: boolean;
  expiryNotice?: string;
}

export interface BasketComparison {
  staples: string[];
  retailers: {
    name: string;
    code: string;
    basketTotalZar: number;
    status: string;
    differenceZar: number;
    deliveryFeeZar: number;
    loyaltyProgram: string;
    highlights: string[];
    itemPrices: Record<string, number>;
  }[];
}

export interface ExpenseItem {
  id: string;
  title: string;
  category: 'Groceries' | 'Transport' | 'Clothing' | 'Textbooks' | 'Tech' | 'Entertainment' | 'Dining';
  amountZar: number;
  date: string;
  formattedDate: string;
  iconType?: 'dining' | 'transit' | 'clothing' | 'book' | 'tech' | 'grocery';
  store?: string;
  budgetPeriodId?: string;
}

export interface SavedShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  checked: boolean;
}

export interface SavedShoppingList {
  id: string;
  title: string;
  items: SavedShoppingListItem[];
  savedAt: string;
  completed: boolean;
}

export interface BudgetPeriod {
  id: string;
  startDate: string;
  endDate?: string;
  budgetZar: number;
  spentZar: number;
  status: 'active' | 'closed';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  products?: Product[];
  quickSuggestions?: string[];
  groundingSources?: { web?: { uri?: string; title?: string } }[];
}

export interface PriceAlert {
  id: string;
  productId: string;
  productTitle: string;
  store: string;
  targetPriceZar: number;
  currentPriceZar: number;
  alertDate: string;
  active: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  university: string;
  campus: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  privacySettings?: {
    personalizeAssistantName?: boolean;
  };
  currency: Currency;
  monthlyBudgetZar: number;
  loyaltyCards: {
    checkersXtra: boolean;
    pnpSmartShopper: boolean;
    wooliesWRewards: boolean;
    sparRewards: boolean;
  };
}
