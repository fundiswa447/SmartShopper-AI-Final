import React, { useEffect, useState } from 'react';
import {
  ScreenId,
  Currency,
  Product,
  ExpenseItem,
  UserProfile,
  BudgetPeriod,
  SavedShoppingList,
  SavedShoppingListItem,
} from './types';

import {
  INITIAL_USER_PROFILE,
  INITIAL_PRODUCTS,
  applyRetailerGroceryBranding,
} from './data/mockData';

import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { HomeScreen } from './components/HomeScreen';
import { NearbyStoresMap } from './components/NearbyStoresMap';
import { PurchaseHistoryScreen } from './components/PurchaseHistoryScreen';
import { SearchScreen } from './components/SearchScreen';
import { AssistantScreen } from './components/AssistantScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { ShoppingListScreen } from './components/ShoppingListScreen';
import { GroceryWatchScreen } from './components/GroceryWatchScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { TripReceiptScreen } from './components/TripReceiptScreen';
import { LogExpenseModal } from './components/LogExpenseModal';
import {
  NotificationsDrawer,
  AppNotification,
} from './components/NotificationsDrawer';
import { LoginScreen } from './components/LoginScreen';
import { CreateAccountScreen } from './components/CreateAccountScreen';
import { searchRealtimePrices } from './services/geminiService';

type AuthScreen = 'login' | 'create';
const GROCERY_PRICE_REFRESH_DELAY_MS = 2 * 24 * 60 * 60 * 1000;

interface SavedAccount {
  name: string;
  email: string;
  password: string;
}

interface SavedUserData {
  profile: UserProfile;
  expenses: ExpenseItem[];
  trackedProductIds: string[];
  budgetPeriods: BudgetPeriod[];
  shoppingListQuery: string;
}

const userDataKey = (email: string) =>
  `smartshopper_data_${email.trim().toLowerCase()}`;
const signInAtKey = (email: string) =>
  `smartshopper_signin_at_${email.trim().toLowerCase()}`;
const groceryPriceRefreshKey = (email: string) =>
  `smartshopper_grocery_prices_refreshed_at_${email.trim().toLowerCase()}`;
const groceryPriceRefreshAttemptKey = (email: string) =>
  `smartshopper_grocery_prices_attempted_at_${email.trim().toLowerCase()}`;
const groceryPriceOverridesKey = (email: string) =>
  `smartshopper_grounded_grocery_prices_${email.trim().toLowerCase()}`;
const savedShoppingListsKey = (email: string) =>
  `smartshopper_saved_lists_${email.trim().toLowerCase()}`;

const groceryProductKey = (product: Product) =>
  `${product.store.toLowerCase()}|${product.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()}`;

const mergeGroceryPriceOverrides = (catalogue: Product[], updates: Product[]) => {
  const brandedUpdates = updates.map(applyRetailerGroceryBranding);
  const pendingUpdates = new Map(brandedUpdates.map((product) => [groceryProductKey(product), product]));
  const merged = catalogue.map((product) => {
    const update = pendingUpdates.get(groceryProductKey(product));
    if (!update) return product;
    pendingUpdates.delete(groceryProductKey(product));
    return {
      ...product,
      priceZar: update.priceZar,
      originalPriceZar: update.originalPriceZar,
      discountPercent: update.discountPercent,
      inStock: update.inStock,
      location: update.location || product.location,
    };
  });
  return [...merged, ...pendingUpdates.values()];
};

const loadProductsForAccount = (email: string): Product[] => {
  if (typeof window === 'undefined' || !email) return INITIAL_PRODUCTS;
  try {
    const updates = JSON.parse(window.localStorage.getItem(groceryPriceOverridesKey(email)) || '[]');
    return Array.isArray(updates) ? mergeGroceryPriceOverrides(INITIAL_PRODUCTS, updates) : INITIAL_PRODUCTS;
  } catch {
    return INITIAL_PRODUCTS;
  }
};

const getStoredAccounts = (): SavedAccount[] => {
  if (typeof window === 'undefined') return [];
  try {
    const accounts = JSON.parse(window.localStorage.getItem('smartshopper_accounts') || '[]');
    const validAccounts: SavedAccount[] = Array.isArray(accounts)
      ? accounts.filter((account): account is SavedAccount =>
          Boolean(account?.name && account?.email && account?.password) &&
          account.email.toLowerCase() !== 'student@smartshopper.com'
        )
      : [];
    if (validAccounts.length !== accounts.length) {
      window.localStorage.setItem('smartshopper_accounts', JSON.stringify(validAccounts));
    }
    return validAccounts;
  } catch {
    return [];
  }
};

const makeEmptyUserData = (name: string, email: string): SavedUserData => {
  const profile: UserProfile = {
    ...INITIAL_USER_PROFILE,
    name,
    email,
    monthlyBudgetZar: 0,
    location: '',
    latitude: undefined,
    longitude: undefined,
  };
  return {
    profile,
    expenses: [],
    trackedProductIds: [],
    shoppingListQuery: '',
    budgetPeriods: [{
      id: `budget-${Date.now()}`,
      startDate: new Date().toISOString(),
      budgetZar: 0,
      spentZar: 0,
      status: 'active',
    }],
  };
};

const loadUserData = (name: string, email: string): SavedUserData => {
  if (typeof window === 'undefined') return makeEmptyUserData(name, email);
  try {
    const saved = window.localStorage.getItem(userDataKey(email));
    if (!saved) return makeEmptyUserData(name, email);
    const parsed = JSON.parse(saved) as Partial<SavedUserData>;
    const fallback = makeEmptyUserData(name, email);
    return {
      profile: { ...fallback.profile, ...parsed.profile, name, email },
      expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
      trackedProductIds: Array.isArray(parsed.trackedProductIds) ? parsed.trackedProductIds : [],
      shoppingListQuery: typeof parsed.shoppingListQuery === 'string' ? parsed.shoppingListQuery : '',
      budgetPeriods: Array.isArray(parsed.budgetPeriods) && parsed.budgetPeriods.length
        ? parsed.budgetPeriods
        : fallback.budgetPeriods,
    };
  } catch {
    return makeEmptyUserData(name, email);
  }
};

const loadSavedShoppingLists = (email: string): SavedShoppingList[] => {
  if (typeof window === 'undefined' || !email) return [];
  try {
    const saved = window.localStorage.getItem(savedShoppingListsKey(email));
    if (!saved) return [];
    const parsed = JSON.parse(saved) as Partial<SavedShoppingList>[];
    return Array.isArray(parsed)
      ? parsed
          .filter((entry): entry is SavedShoppingList => Boolean(entry && typeof entry.id === 'string' && Array.isArray(entry.items)))
          .map((entry) => ({
            id: entry.id,
            title: typeof entry.title === 'string' ? entry.title : 'Saved shopping list',
            savedAt: typeof entry.savedAt === 'string' ? entry.savedAt : new Date().toISOString(),
            completed: Boolean(entry.completed),
            items: entry.items.map((item, index) => ({
              id: typeof item?.id === 'string' ? item.id : `item-${entry.id}-${index}`,
              name: typeof item?.name === 'string' ? item.name : 'Item',
              quantity: Number(item?.quantity) > 0 ? Number(item?.quantity) : 1,
              checked: Boolean(item?.checked),
            })),
          }))
      : [];
  } catch {
    return [];
  }
};

export default function App() {
  const initialPath = typeof window === 'undefined' ? '/' : window.location.pathname;
  const initialEmail = typeof window === 'undefined'
    ? ''
    : window.localStorage.getItem('smartshopper_current_email') || '';
  const initialAccounts = getStoredAccounts();
  const initialAccount = initialAccounts.find(
    (account) => account.email.toLowerCase() === initialEmail.toLowerCase()
  );
  const hasSavedSession = typeof window !== 'undefined' &&
    window.localStorage.getItem('smartshopper_logged_in') === 'true' &&
    Boolean(initialAccount);
  const initialUserData = hasSavedSession && initialAccount
    ? loadUserData(initialAccount.name, initialAccount.email)
    : makeEmptyUserData('', '');

  const [isLoggedIn, setIsLoggedIn] = useState(hasSavedSession);

  const [authScreen, setAuthScreen] = useState<AuthScreen>(
    initialPath === '/signup' || initialAccounts.length === 0 ? 'create' : 'login'
  );
  const [showAuthScreen, setShowAuthScreen] = useState(
    !hasSavedSession || initialPath === '/login' || initialPath === '/signup'
  );
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [currency, setCurrency] = useState<Currency>(initialUserData.profile.currency);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserData.profile);
  const [products, setProducts] = useState<Product[]>(() =>
    hasSavedSession && initialEmail ? loadProductsForAccount(initialEmail) : INITIAL_PRODUCTS
  );
  const [expenses, setExpenses] = useState<ExpenseItem[]>(initialUserData.expenses);
  const [trackedProductIds, setTrackedProductIds] = useState<Set<string>>(
    new Set(initialUserData.trackedProductIds)
  );
  const [signedInAt, setSignedInAt] = useState(() => {
    if (!hasSavedSession || !initialEmail) return 0;
    return Number(window.localStorage.getItem(signInAtKey(initialEmail))) || Date.now();
  });
  const [lastGroceryPriceRefreshAt, setLastGroceryPriceRefreshAt] = useState(() => {
    if (!hasSavedSession || !initialEmail) return 0;
    return Number(window.localStorage.getItem(groceryPriceRefreshKey(initialEmail))) || 0;
  });
  const [lastGroceryPriceRefreshAttemptAt, setLastGroceryPriceRefreshAttemptAt] = useState(() => {
    if (!hasSavedSession || !initialEmail) return 0;
    return Number(window.localStorage.getItem(groceryPriceRefreshAttemptKey(initialEmail))) || 0;
  });
  const [groceryPriceRefreshStatus, setGroceryPriceRefreshStatus] = useState(
    hasSavedSession
      ? 'Grocery combo prices refresh 48 hours after sign-in when grounded store prices are available.'
      : ''
  );
  const [isRefreshingGroceryPrices, setIsRefreshingGroceryPrices] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [shoppingListQuery, setShoppingListQuery] = useState('');
  const [budgetPeriods, setBudgetPeriods] = useState<BudgetPeriod[]>(initialUserData.budgetPeriods);
  const [searchBudget, setSearchBudget] = useState<number | undefined>(undefined);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showTripReceipt, setShowTripReceipt] = useState(false);
  const [tripReceiptItems, setTripReceiptItems] = useState<Array<{
    id: string;
    name: string;
    quantity: number;
    priceZar: number;
    store?: string;
    completed: boolean;
  }>>([]);
  const [savedShoppingLists, setSavedShoppingLists] = useState<SavedShoppingList[]>(() =>
    hasSavedSession && initialEmail ? loadSavedShoppingLists(initialEmail) : []
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      type: 'price_drop',
      title: 'Checkers White Bread dropped by 20%',
      message:
        'Albany Superior White Bread 700g is now R20.99 (was R25.99) at Campus Square.',
      timeAgo: '15m ago',
      read: false,
      savingsZar: 5.0,
      targetScreen: 'pricewatch',
    },
    {
      id: 'notif-2',
      type: 'deal_match',
      title: 'Winter Jacket Alert under R800',
      message: 'K-Way Elements Parka at Takealot dropped to R650 (28% off).',
      timeAgo: '2h ago',
      read: false,
      savingsZar: 249.0,
      targetScreen: 'search',
    },
    {
      id: 'notif-3',
      type: 'budget_warning',
      title: 'Monthly Budget Health Check',
      message: 'You have reached 75% of your July allowance with 15 days remaining.',
      timeAgo: '1d ago',
      read: true,
      targetScreen: 'dashboard',
    },
  ]);

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const activeBudgetPeriod = budgetPeriods.find((period) => period.status === 'active');
  const currentPeriodExpenses = activeBudgetPeriod
    ? expenses.filter((expense) => !expense.budgetPeriodId || expense.budgetPeriodId === activeBudgetPeriod.id)
    : expenses;
  const spentBudgetZar = currentPeriodExpenses.reduce((total, expense) => total + expense.amountZar, 0);
  const remainingBudgetZar = Math.max(0, userProfile.monthlyBudgetZar - spentBudgetZar);
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  useEffect(() => {
    if (!isLoggedIn || !userProfile.email) return;
    const data: SavedUserData = {
      profile: userProfile,
      expenses,
      trackedProductIds: Array.from(trackedProductIds),
      budgetPeriods,
      shoppingListQuery,
    };
    window.localStorage.setItem(userDataKey(userProfile.email), JSON.stringify(data));
  }, [isLoggedIn, userProfile, expenses, trackedProductIds, budgetPeriods, shoppingListQuery]);

  useEffect(() => {
    if (!isLoggedIn || !userProfile.email) return;
    window.localStorage.setItem(savedShoppingListsKey(userProfile.email), JSON.stringify(savedShoppingLists));
  }, [isLoggedIn, userProfile.email, savedShoppingLists]);

  useEffect(() => {
    if (!isLoggedIn || !userProfile.email || !signedInAt) return;
    window.localStorage.setItem(signInAtKey(userProfile.email), String(signedInAt));
  }, [isLoggedIn, userProfile.email, signedInAt]);

  useEffect(() => {
    if (!isLoggedIn || !userProfile.email || !signedInAt) return;

    const dueAt = signedInAt + GROCERY_PRICE_REFRESH_DELAY_MS;
    if (lastGroceryPriceRefreshAt >= signedInAt || lastGroceryPriceRefreshAttemptAt >= signedInAt) return;

    const refreshPrices = async () => {
      const attemptAt = Date.now();
      setLastGroceryPriceRefreshAttemptAt(attemptAt);
      window.localStorage.setItem(groceryPriceRefreshAttemptKey(userProfile.email), String(attemptAt));
      setGroceryPriceRefreshStatus('Checking grounded grocery prices after your 48-hour sign-in window…');

      try {
        const result = await searchRealtimePrices({
          query: 'current prices for rice, maize meal, cooking oil, oats, Weet-Bix, noodles, fresh fruit and vegetables',
          category: 'Groceries',
          storeFilter: ['Shoprite', 'Boxer', 'Food Lover\'s Market'],
          location: userProfile.location || 'South Africa',
        });
        const groundedResults = result.results.filter((product) =>
          ['Shoprite', 'Boxer', 'Food Lover\'s Market'].includes(product.store) &&
          product.category === 'Groceries' &&
          product.title.trim().length > 0 &&
          Number.isFinite(product.priceZar) &&
          product.priceZar > 0
        );
        const hasGroundingSource = result.groundingSources?.some((source) => Boolean(source.web?.uri));

        if (result.source !== 'gemini-grounded-search' || !hasGroundingSource || groundedResults.length === 0) {
          setGroceryPriceRefreshStatus('No grounded store prices were returned. Current catalogue prices are unchanged.');
          return;
        }

        setProducts((previous) => mergeGroceryPriceOverrides(previous, groundedResults));
        const refreshedAt = Date.now();
        setLastGroceryPriceRefreshAt(refreshedAt);
        window.localStorage.setItem(groceryPriceRefreshKey(userProfile.email), String(refreshedAt));
        window.localStorage.setItem(groceryPriceOverridesKey(userProfile.email), JSON.stringify(groundedResults));
        setGroceryPriceRefreshStatus(`Grounded grocery prices updated ${new Date(refreshedAt).toLocaleString()}.`);
      } catch {
        setGroceryPriceRefreshStatus('Grocery price refresh failed. Current catalogue prices are unchanged.');
      }
    };

    const timerId = window.setTimeout(refreshPrices, Math.max(0, dueAt - Date.now()));
    return () => window.clearTimeout(timerId);
  }, [
    isLoggedIn,
    userProfile.email,
    userProfile.location,
    signedInAt,
    lastGroceryPriceRefreshAt,
    lastGroceryPriceRefreshAttemptAt,
  ]);

  const handleCurrencyToggle = (nextCurrency: Currency) => {
    setCurrency(nextCurrency);
    setUserProfile((previous) => ({ ...previous, currency: nextCurrency }));
  };

  const handleLogin = (name: string) => {
    const email = window.localStorage.getItem('smartshopper_current_email');
    if (!email) return;
    const savedData = loadUserData(name, email);
    setUserProfile(savedData.profile);
    setCurrency(savedData.profile.currency);
    setExpenses(savedData.expenses);
    setTrackedProductIds(new Set(savedData.trackedProductIds));
    setBudgetPeriods(savedData.budgetPeriods);
    setShoppingListQuery(savedData.shoppingListQuery);
    setSavedShoppingLists(loadSavedShoppingLists(email));
    setProducts(loadProductsForAccount(email));
    const signInTimestamp = Date.now();
    setSignedInAt(signInTimestamp);
    setLastGroceryPriceRefreshAt(Number(window.localStorage.getItem(groceryPriceRefreshKey(email))) || 0);
    setLastGroceryPriceRefreshAttemptAt(Number(window.localStorage.getItem(groceryPriceRefreshAttemptKey(email))) || 0);
    setGroceryPriceRefreshStatus('Grocery combo prices refresh 48 hours after sign-in when grounded store prices are available.');

    window.localStorage.setItem('smartshopper_logged_in', 'true');
    window.history.replaceState({}, '', '/');
    setIsLoggedIn(true);
    setShowAuthScreen(false);
    showToast(`Welcome back, ${name}!`);
  };

  const handleCreateAccount = (name: string, email: string, password: string) => {
    const accounts: SavedAccount[] = getStoredAccounts();

    if (accounts.some((account) => account.email.toLowerCase() === email.toLowerCase())) {
      showToast('An account with this email already exists.');
      return;
    }
    accounts.push({ name, email, password });

    window.localStorage.setItem('smartshopper_accounts', JSON.stringify(accounts));
    window.localStorage.setItem('smartshopper_current_email', email);

    const freshData = makeEmptyUserData(name, email);
    setUserProfile(freshData.profile);
    setCurrency(freshData.profile.currency);
    setExpenses(freshData.expenses);
    setTrackedProductIds(new Set(freshData.trackedProductIds));
    setBudgetPeriods(freshData.budgetPeriods);
    setShoppingListQuery('');
    setSavedShoppingLists([]);
    setProducts(loadProductsForAccount(email));
    setNotifications([]);
    const signInTimestamp = Date.now();
    setSignedInAt(signInTimestamp);
    setLastGroceryPriceRefreshAt(0);
    setLastGroceryPriceRefreshAttemptAt(0);
    setGroceryPriceRefreshStatus('Grocery combo prices refresh 48 hours after sign-in when grounded store prices are available.');

    window.localStorage.setItem('smartshopper_logged_in', 'true');
    window.history.replaceState({}, '', '/');
    setIsLoggedIn(true);
    setShowAuthScreen(false);
    showToast(`Account created successfully. Welcome, ${name}!`);
  };

  const openAuthentication = () => {
    const accounts = getStoredAccounts();

    const nextAuthScreen = accounts.length > 0 ? 'login' : 'create';
    setAuthScreen(nextAuthScreen);
    window.history.pushState({}, '', nextAuthScreen === 'login' ? '/login' : '/signup');
    setShowAuthScreen(true);
  };

  const handleNavigate = (screen: ScreenId) => {
    if (!isLoggedIn && screen !== 'home') {
      openAuthentication();
      return;
    }

    setCurrentScreen(screen);
  };

  const handleGlobalSearchSubmit = (query: string, budget?: number) => {
    if (!isLoggedIn) {
      openAuthentication();
      return;
    }

    setSearchQuery(query);
    setShoppingListQuery(query);
    setSearchBudget(budget);

    if (currentScreen === 'shoppinglist') {
      setCurrentScreen('shoppinglist');
      return;
    }

    setCurrentScreen('search');
  };

  const handleToggleTrack = (product: Product) => {
    setTrackedProductIds((previous) => {
      const next = new Set(previous);

      if (next.has(product.id)) {
        next.delete(product.id);
        showToast('Removed from your watchlist.');
      } else {
        next.add(product.id);
        showToast('Added to your watchlist.');
      }

      return next;
    });
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    const hasNewBudget = updatedProfile.monthlyBudgetZar !== userProfile.monthlyBudgetZar;

    setUserProfile(updatedProfile);

    if (hasNewBudget) {
      const now = new Date().toISOString();
      const closedPeriods = budgetPeriods.map((period) => period.status === 'active'
        ? { ...period, status: 'closed' as const, endDate: now }
        : period
      );
      setBudgetPeriods([...closedPeriods, {
        id: `budget-${Date.now()}`,
        startDate: now,
        budgetZar: updatedProfile.monthlyBudgetZar,
        spentZar: 0,
        status: 'active',
      }]);
      showToast('New monthly budget saved. Previous spending remains in your history.');
    }
  };

  const handleLocationResolved = (locationPatch: Partial<UserProfile>) => {
    setUserProfile((previous) => ({ ...previous, ...locationPatch }));
  };

  const handleAddExpense = (expense: ExpenseItem) => {
    const activePeriod = budgetPeriods.find((period) => period.status === 'active');
    const expenseWithPeriod = { ...expense, budgetPeriodId: activePeriod?.id };
    setExpenses((previous) => [expenseWithPeriod, ...previous]);
    if (activePeriod) {
      setBudgetPeriods((previous) => previous.map((period) => period.id === activePeriod.id
        ? { ...period, spentZar: period.spentZar + expense.amountZar }
        : period
      ));
    }
    showToast('Expense added successfully.');
  };

  const handleAddProducts = (newProducts: Product[]) => {
    setProducts((previous) => [
      ...previous,
      ...newProducts.map(applyRetailerGroceryBranding),
    ]);
  };

  const handleAddToShoppingList = (product: Product) => {
    const nextItem = product.title.trim();

    setShoppingListQuery((previous) => {
      const existingItems = previous
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter(Boolean);

      if (existingItems.includes(nextItem)) {
        return previous;
      }

      const nextValue = previous ? `${previous}\n${nextItem}` : nextItem;
      return nextValue;
    });

    setCurrentScreen('shoppinglist');
    showToast(`${product.title} added to your shopping list.`);
  };

  const handleRepeatPurchase = (title: string) => {
    setShoppingListQuery((previous) => {
      const items = previous.split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
      return items.some((item) => item.toLowerCase() === title.toLowerCase())
        ? previous
        : [...items, title].join('\n');
    });
    setCurrentScreen('shoppinglist');
    showToast(`${title} added to your future shopping list.`);
  };

  const handleRepeatSavedShoppingList = (list: SavedShoppingList) => {
    const nextItems = list.items.map((item) => `${item.name}${item.quantity > 1 ? ` x${item.quantity}` : ''}`).join('\n');
    setShoppingListQuery(nextItems);
    setCurrentScreen('shoppinglist');
    showToast(`${list.title} is ready to repeat in your shopping list.`);
  };

  const handleUpdateSavedShoppingList = (listId: string, items: SavedShoppingListItem[]) => {
    setSavedShoppingLists((previous) => previous.map((list) => list.id === listId ? { ...list, items, completed: items.length > 0 && items.every((item) => item.checked) } : list));
  };

  const handleAddComboToShoppingList = (titles: string[]) => {
    const counts = new Map<string, number>();
    titles.forEach((title) => counts.set(title, (counts.get(title) || 0) + 1));
    const additions = Array.from(counts, ([title, quantity]) => quantity > 1 ? `${title} x${quantity}` : title);
    setShoppingListQuery((previous) => {
      const existing = previous.split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
      return [...existing, ...additions].join('\n');
    });
    setCurrentScreen('shoppinglist');
    showToast('Added to your shopping list.');
  };

  const openTripReceipt = (items: Array<{
    id: string;
    name: string;
    quantity: number;
    priceZar: number;
    store?: string;
    completed: boolean;
  }>) => {
    setTripReceiptItems(items);
    setShowTripReceipt(true);
  };

  const handleLogout = () => {
    window.localStorage.removeItem('smartshopper_logged_in');
    window.localStorage.removeItem('smartshopper_current_email');

    setIsLoggedIn(false);
    setShowAuthScreen(true);
    setAuthScreen('login');
    setCurrentScreen('home');
    window.history.replaceState({}, '', '/');
    showToast('You have been logged out.');
  };

  const handleForgotPassword = () => {
    if (typeof window === 'undefined') return;

    const accounts: SavedAccount[] = JSON.parse(
      window.localStorage.getItem('smartshopper_accounts') || '[]'
    );

    if (typeof window.prompt !== 'function') {
      window.alert('Password reset is unavailable in this browser. Please sign in from a browser that supports account recovery prompts.');
      return;
    }

    const email = window.prompt(
      'Enter the email address associated with your SmartShopper account:'
    );

    if (!email) {
      return;
    }

    const accountIndex = accounts.findIndex(
      (account) => account.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (accountIndex === -1) {
      window.alert('No SmartShopper account was found with that email address.');
      return;
    }

    const newPassword = window.prompt('Enter your new password (at least 6 characters):');

    if (!newPassword) {
      return;
    }

    if (newPassword.length < 6) {
      window.alert('Password must be at least 6 characters.');
      return;
    }

    accounts[accountIndex].password = newPassword;
    window.localStorage.setItem('smartshopper_accounts', JSON.stringify(accounts));
    window.alert('Your password has been changed successfully. You can now sign in with your new password.');
  };

  const markAllRead = () => {
    setNotifications((previous) => previous.map((notification) => ({ ...notification, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  if (showAuthScreen || !isLoggedIn) {
    if (authScreen === 'create') {
      return (
        <CreateAccountScreen
          onAccountCreated={handleCreateAccount}
          onBackToLogin={() => {
            window.history.pushState({}, '', '/login');
            setAuthScreen('login');
          }}
        />
      );
    }

    return (
      <LoginScreen
        onLogin={handleLogin}
        onCreateAccount={() => {
          window.history.pushState({}, '', '/signup');
          setAuthScreen('create');
        }}
        onForgotPassword={handleForgotPassword}
      />
    );
  }

  if (showTripReceipt) {
    return (
      <TripReceiptScreen
        profile={userProfile}
        items={tripReceiptItems}
        currency={currency}
        totalBudgetZar={userProfile.monthlyBudgetZar}
        spentBudgetZar={spentBudgetZar}
        onBack={() => setShowTripReceipt(false)}
        onCompletePurchase={(purchasedItems) => {
          const now = new Date();
          const activePeriod = budgetPeriods.find((period) => period.status === 'active');
          const purchaseExpenses: ExpenseItem[] = purchasedItems.map((item, index) => {
            const product = products.find((entry) => entry.id === item.id);
            const category: ExpenseItem['category'] = product?.category === 'Clothing' || product?.category === 'Footwear'
              ? 'Clothing'
              : product?.category === 'Tech' || product?.category === 'Electronics'
                ? 'Tech'
                : 'Groceries';
            return {
              id: `purchase-${now.getTime()}-${index}`,
              title: item.name,
              category,
              amountZar: item.priceZar * item.quantity,
              date: now.toISOString(),
              formattedDate: now.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' }),
              store: item.store,
              budgetPeriodId: activePeriod?.id,
            };
          });
          const nextSavedList: SavedShoppingList = {
            id: `saved-list-${now.getTime()}`,
            title: `Shopping trip · ${now.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}`,
            savedAt: now.toISOString(),
            completed: false,
            items: purchasedItems.map((item) => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              checked: false,
            })),
          };
          setSavedShoppingLists((previous) => [nextSavedList, ...previous]);
          setExpenses((previous) => [...purchaseExpenses, ...previous]);
          if (activePeriod) {
            const addedAmount = purchaseExpenses.reduce((total, expense) => total + expense.amountZar, 0);
            setBudgetPeriods((previous) => previous.map((period) => period.id === activePeriod.id
              ? { ...period, spentZar: period.spentZar + addedAmount }
              : period
            ));
          }
          setShowTripReceipt(false);
          showToast('Receipt saved to your shopping history and to-do list.');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        currentScreen={currentScreen}
        onSelectScreen={handleNavigate}
          onLogout={handleLogout}
        showProTip={currentScreen === 'search' || currentScreen === 'pricewatch'}
      />

      <div className="flex-1 min-w-0">
        <TopHeader
          currentScreen={currentScreen}
          currency={currency}
          remainingBudgetZar={remainingBudgetZar}
          onCurrencyToggle={handleCurrencyToggle}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onSelectScreen={handleNavigate}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={(query) => handleGlobalSearchSubmit(query)}
          notificationCount={unreadCount}
          userName={userProfile.name}
        />

        <main className="p-4 sm:p-6 lg:p-8">
          {currentScreen === 'home' && (
            <HomeScreen
              currency={currency}
              remainingBudgetZar={remainingBudgetZar}
              totalBudgetZar={userProfile.monthlyBudgetZar}
              spentBudgetZar={spentBudgetZar}
              onNavigate={(screen: ScreenId, query?: string, budget?: number) => {
                if (screen === 'search') {
                  handleGlobalSearchSubmit(query || '', budget);
                } else {
                  handleNavigate(screen);
                }
              }}
              featuredProducts={products}
              onToggleTrack={handleToggleTrack}
              trackedProductIds={trackedProductIds}
              profile={userProfile}
              onLocationResolved={handleLocationResolved}
              onAddComboToShoppingList={handleAddComboToShoppingList}
              groceryPriceRefreshStatus={groceryPriceRefreshStatus}
            />
          )}

          {currentScreen === 'search' && (
            <SearchScreen
              currency={currency}
              remainingBudgetZar={remainingBudgetZar}
              initialQuery={searchQuery}
              initialMaxBudget={searchBudget}
              products={products}
              onToggleTrack={handleToggleTrack}
              trackedProductIds={trackedProductIds}
              onAddProducts={handleAddProducts}
              onAddToShoppingList={handleAddToShoppingList}
            />
          )}

          {currentScreen === 'assistant' && (
            <AssistantScreen
              currency={currency}
              remainingBudgetZar={remainingBudgetZar}
              userName={userProfile.name}
              personalizeName={userProfile.privacySettings?.personalizeAssistantName ?? true}
              onToggleTrack={handleToggleTrack}
              trackedProductIds={trackedProductIds}
              onNavigate={handleNavigate}
            />
          )}

          {currentScreen === 'dashboard' && (
            <DashboardScreen
              currency={currency}
              userName={userProfile.name}
              totalBudgetZar={userProfile.monthlyBudgetZar}
              spentBudgetZar={spentBudgetZar}
              remainingBudgetZar={remainingBudgetZar}
              expenses={expenses}
              budgetPeriods={budgetPeriods}
              onOpenLogModal={() => setIsLogModalOpen(true)}
              onNavigate={(screen, query) => {
                if (screen === 'search') {
                  handleGlobalSearchSubmit(query || '');
                } else {
                  handleNavigate(screen);
                }
              }}
            />
          )}

          {currentScreen === 'shoppinglist' && (
            <ShoppingListScreen
              products={products}
              currency={currency}
              onToggleTrack={handleToggleTrack}
              trackedProductIds={trackedProductIds}
              shoppingListQuery={shoppingListQuery}
              onShoppingListQueryChange={setShoppingListQuery}
              onOpenTripReceipt={openTripReceipt}
              budgetRemainingZar={remainingBudgetZar}
              monthlyBudgetZar={userProfile.monthlyBudgetZar}
              profile={userProfile}
            />
          )}

          {currentScreen === 'history' && (
            <PurchaseHistoryScreen
              expenses={expenses}
              currency={currency}
              remainingBudgetZar={remainingBudgetZar}
              savedShoppingLists={savedShoppingLists}
              onAddToShoppingList={handleRepeatPurchase}
              onRepeatShoppingList={handleRepeatSavedShoppingList}
              onUpdateSavedShoppingList={handleUpdateSavedShoppingList}
            />
          )}

          {currentScreen === 'pricewatch' && (
            <GroceryWatchScreen
              currency={currency}
              onToggleTrack={handleToggleTrack}
              trackedProductIds={trackedProductIds}
              priceDropProducts={products.filter(
                (product) => product.category === 'Groceries' && product.discountPercent
              )}
            />
          )}

          {currentScreen === 'profile' && (
            <ProfileScreen
              profile={userProfile}
              onUpdateProfile={handleUpdateProfile}
              currency={currency}
            />
          )}
        </main>
      </div>

      <LogExpenseModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onAddExpense={handleAddExpense}
        currency={currency}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={markAllRead}
        onClearAll={clearNotifications}
        onNavigate={handleNavigate}
        currency={currency}
      />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-gray-900 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium">
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
}
