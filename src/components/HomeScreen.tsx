import React, { useEffect, useState } from 'react';
import { Sparkles, Search, ArrowUpRight, TrendingDown, ShoppingBag, ShieldCheck, Heart, Bell, Tag, ShoppingCart, ArrowRight } from 'lucide-react';
import { Currency, ScreenId, Product, UserProfile } from '../types';
import { formatPrice } from '../data/mockData';
import { ProductImage } from './ProductImage';
import { NearbyStoresMap } from './NearbyStoresMap';

interface HomeScreenProps {
  currency: Currency;
  remainingBudgetZar: number;
  totalBudgetZar: number;
  spentBudgetZar: number;
  onNavigate: (screen: ScreenId, query?: string, budget?: number) => void;
  featuredProducts: Product[];
  onToggleTrack: (product: Product) => void;
  trackedProductIds: Set<string>;
  profile: UserProfile;
  onLocationResolved: (location: Partial<UserProfile>) => void;
  onAddComboToShoppingList: (items: string[]) => void;
  groceryPriceRefreshStatus: string;
}

const GROCERY_SPECIALS_STORAGE_KEY = 'smartshopper_grocery_specials_expires_at';
const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currency,
  remainingBudgetZar,
  totalBudgetZar,
  spentBudgetZar,
  onNavigate,
  featuredProducts,
  onToggleTrack,
  trackedProductIds,
  profile,
  onLocationResolved,
  onAddComboToShoppingList,
  groceryPriceRefreshStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [maxBudgetInput, setMaxBudgetInput] = useState('');
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [grocerySpecialsExpireAt] = useState(() => {
    if (typeof window === 'undefined') return Date.now() + FIVE_DAYS_MS;
    const storedExpiration = Number(window.localStorage.getItem(GROCERY_SPECIALS_STORAGE_KEY));
    if (Number.isFinite(storedExpiration) && storedExpiration > 0) return storedExpiration;
    const expiration = Date.now() + FIVE_DAYS_MS;
    window.localStorage.setItem(GROCERY_SPECIALS_STORAGE_KEY, String(expiration));
    return expiration;
  });

  useEffect(() => {
    const intervalId = window.setInterval(() => setCurrentDate(new Date()), 30_000);
    return () => window.clearInterval(intervalId);
  }, []);
  const findGrocery = (store: Product['store'], term: string) => featuredProducts
    .filter((product) => product.category === 'Groceries' && product.store === store && product.inStock && product.title.toLowerCase().includes(term))
    .sort((first, second) => first.priceZar - second.priceZar)[0];
  const grocerySpecialDefinitions = [
    { id: 'shoprite-pantry', title: 'Pantry staples', store: 'Shoprite' as const, terms: ['rice', 'maize meal', 'cooking oil'] },
    { id: 'boxer-pantry', title: 'Pantry staples', store: 'Boxer' as const, terms: ['rice', 'maize meal', 'cooking oil'] },
    { id: 'shoprite-breakfast', title: 'Breakfast & quick meals', store: 'Shoprite' as const, terms: ['oats', 'noodles'] },
    { id: 'boxer-breakfast', title: 'Breakfast & quick meals', store: 'Boxer' as const, terms: ['oats', 'weet-bix'] },
  ];
  const comboDeals = grocerySpecialDefinitions.flatMap((definition) => {
    const items = definition.terms.map((term) => findGrocery(definition.store, term));
    if (items.some((product) => !product)) return [];
    return [{
      ...definition,
      items: items as Product[],
    }];
  });
  const grocerySpecialsActive = currentDate.getTime() < grocerySpecialsExpireAt;
  const grocerySpecialExpiryLabel = new Date(grocerySpecialsExpireAt).toLocaleDateString('en-ZA', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  const twoForTwentyDeals = featuredProducts
    .filter((product) => ['Groceries', 'Snacks'].includes(product.category) && product.discountPercent && product.priceZar * 2 <= 20)
    .slice(0, 3);
  const foodLoversFreshProducts = featuredProducts
    .filter((product) => product.store === 'Food Lover\'s Market' && ['Fruits', 'Vegetables', 'Dairy Foods'].includes(product.subcategory || ''))
    .slice(0, 4);
  const groceryPromotions = featuredProducts
    .filter((product) => product.category === 'Groceries' && typeof product.originalPriceZar === 'number' && product.originalPriceZar > product.priceZar)
    .sort((first, second) => (second.discountPercent || 0) - (first.discountPercent || 0))
    .slice(0, 4);
  const bestGroceryDiscount = Math.max(0, ...groceryPromotions.map((product) => product.discountPercent || Math.round((1 - product.priceZar / (product.originalPriceZar || product.priceZar)) * 100)));

  const handleFindDeals = (e: React.FormEvent) => {
    e.preventDefault();
    const budgetNum = maxBudgetInput ? Number(maxBudgetInput) : undefined;
    onNavigate('search', searchQuery.trim(), budgetNum);
  };

  // Donut chart calculation
  const percentRemaining = totalBudgetZar > 0
    ? Math.max(0, Math.min(100, Math.round((remainingBudgetZar / totalBudgetZar) * 100)))
    : 0;
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentRemaining / 100) * circumference;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
      <p className="text-right text-xs font-semibold text-gray-500">
        <time>{currentDate.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · {currentDate.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}</time>
      </p>
      {/* Top Hero & Monthly Budget Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Hero Card */}
        <div className="lg:col-span-8 bg-linear-to-br from-[#f2f8f5] via-[#f7fbf9] to-[#ffffff] border border-emerald-100/70 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xs relative overflow-hidden">
          {/* Subtle decorative background blur glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="relative z-10">
            {/* AI Powered Shopping Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fbf3d5] text-[#855302] text-xs font-semibold mb-6 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
              <span>AI Powered Shopping</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">
              Shop Smarter, <br />
              <span className="text-[#135d38]">Not Harder.</span>
            </h1>

            {/* Subtext */}
            <p className="text-gray-600 text-sm sm:text-base max-w-lg mb-8 leading-relaxed">
              Tell us what you need and your budget. SmartShopper AI will find the best student deals across South African retail stores instantly.
            </p>

            {/* Interactive Search & Budget Form */}
            <form
              onSubmit={handleFindDeals}
              className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2 rounded-2xl border border-gray-200/80 shadow-sm max-w-xl"
              id="hero-deal-search-form"
            >
              {/* Optional Search Query */}
              <div className="flex-1 flex items-center px-3 w-full border-b sm:border-b-0 sm:border-r border-gray-100 py-2">
                <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="What item? (e.g. Milk, Jacket, Shoes)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs sm:text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-hidden"
                />
              </div>

              {/* Set Max Budget */}
              <div className="flex items-center px-3 w-full sm:w-44 py-2">
                <span className="text-gray-400 font-semibold mr-1 text-sm">
                  {currency === 'ZAR' ? 'R' : '$'}
                </span>
                <input
                  type="number"
                  placeholder="Set max budget..."
                  value={maxBudgetInput}
                  onChange={(e) => setMaxBudgetInput(e.target.value)}
                  className="w-full text-xs sm:text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-hidden"
                />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                id="hero-find-deals-button"
                className="w-full sm:w-auto bg-[#135d38] hover:bg-[#0f4d2e] text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs hover:shadow-md shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Find Deals</span>
              </button>
            </form>
          </div>

          {/* Quick Category Badges */}
          <div className="relative z-10 mt-8 pt-6 border-t border-emerald-100/60 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 font-medium mr-1">Popular in SA:</span>
            {[
              { label: 'Checkers Grocery Staples', q: 'staples', b: 300 },
              { label: 'Pick n Pay Dairy', q: 'milk bread eggs', b: 200 },
              { label: 'Takealot Tech Deals', q: 'tech cables', b: 400 },
              { label: 'Superbalist Sneakers', q: 'sneakers', b: 1500 },
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => onNavigate('search', chip.q, chip.b)}
                className="text-xs bg-white hover:bg-emerald-50 text-gray-600 hover:text-emerald-800 border border-gray-200/60 rounded-full px-3 py-1 font-medium transition-colors cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Monthly Budget Card (Matching Screenshot 1) */}
        <div className="lg:col-span-4 bg-white border border-gray-100 rounded-3xl p-8 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Monthly Budget</h2>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                {new Date().toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-8">
              {totalBudgetZar > 0 && spentBudgetZar > totalBudgetZar
                ? 'You are over your monthly budget.'
                : 'Your monthly spending at a glance.'}
            </p>

            {/* Circular Progress Ring */}
            <div className="flex flex-col items-center justify-center my-4">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#e6edf0"
                    strokeWidth="9"
                    fill="transparent"
                  />
                  {/* Active Progress Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#135d38"
                    strokeWidth="9"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>

                {/* Center Content */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-gray-900 leading-none">
                    {formatPrice(remainingBudgetZar, currency)}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mt-1">
                    Remaining
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown Items */}
          <div className="space-y-3 pt-6 border-t border-gray-100 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#135d38]"></span>
                <span className="text-gray-600 font-medium">Spent this month</span>
              </div>
              <span className="font-bold text-gray-900">{formatPrice(spentBudgetZar, currency)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-gray-600 font-medium">Monthly budget</span>
              </div>
              <span className="font-bold text-gray-900">{formatPrice(totalBudgetZar, currency)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span className="text-gray-600 font-medium">Available now</span>
              </div>
              <span className="font-bold text-gray-900">{formatPrice(Math.max(0, remainingBudgetZar), currency)}</span>
            </div>

            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full mt-4 text-center text-xs font-semibold text-[#135d38] hover:text-emerald-800 py-2 bg-emerald-50/50 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer block"
            >
              View Full Budget Analytics →
            </button>
          </div>
        </div>
      </div>

      <NearbyStoresMap profile={profile} onLocationResolved={onLocationResolved} autoLocate />

      <section className="overflow-hidden border border-emerald-200 bg-white">
        <div className="grid gap-4 bg-[#135d38] p-5 text-white sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
          <div>
            <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase text-emerald-100"><Tag className="h-3.5 w-3.5" /> Grocery specials</p>
            <h2 className="mt-2 text-xl font-black">Good prices for your next basket</h2>
            <p className="mt-1 text-xs text-emerald-100">Featured marked-down groceries from your store catalogue.</p>
          </div>
          <div className="flex items-center gap-4 border-t border-white/20 pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
            <div>
              <span className="block text-2xl font-black">{groceryPromotions.length}</span>
              <span className="text-[10px] font-semibold text-emerald-100">featured deals</span>
            </div>
            {bestGroceryDiscount > 0 && <div className="border-l border-white/20 pl-4"><span className="block text-2xl font-black">{bestGroceryDiscount}%</span><span className="text-[10px] font-semibold text-emerald-100">up to</span></div>}
            <button type="button" onClick={() => onNavigate('search', 'groceries')} className="ml-auto inline-flex items-center gap-2 border border-white/50 px-3 py-2 text-xs font-bold text-white hover:bg-white/10">
              Browse groceries <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        {groceryPromotions.length ? (
          <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4 sm:p-5">
            {groceryPromotions.map((product) => {
              const discount = product.discountPercent || Math.round((1 - product.priceZar / (product.originalPriceZar || product.priceZar)) * 100);
              const saving = (product.originalPriceZar || product.priceZar) - product.priceZar;
              return (
                <article key={product.id} className="overflow-hidden border border-gray-200 bg-white">
                  <div className="relative aspect-[4/3] bg-gray-100">
                    <ProductImage product={product} className="h-full w-full object-cover" />
                    <span className="absolute left-2 top-2 bg-amber-300 px-2 py-1 text-[10px] font-black text-amber-950">-{discount}%</span>
                  </div>
                  <div className="p-3">
                    <p className="truncate text-[10px] font-bold uppercase text-emerald-800">{product.store}</p>
                    <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-bold text-gray-900" title={product.title}>{product.title}</h3>
                    <div className="mt-2 flex items-end justify-between gap-2">
                      <span className="text-lg font-black text-emerald-800">{formatPrice(product.priceZar, currency)}</span>
                      <span className="text-right text-[10px] text-gray-500"><span className="block line-through">{formatPrice(product.originalPriceZar || product.priceZar, currency)}</span>Save {formatPrice(saving, currency)}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => onAddComboToShoppingList([product.title])} className="inline-flex items-center justify-center gap-1 border border-emerald-800 px-2 py-2 text-[10px] font-bold text-emerald-900 hover:bg-emerald-50"><ShoppingCart className="h-3.5 w-3.5" /> Add to list</button>
                      <button type="button" onClick={() => onNavigate('search', product.title)} className="inline-flex items-center justify-center gap-1 border border-gray-200 px-2 py-2 text-[10px] font-bold text-gray-700 hover:bg-gray-50">Compare <ArrowRight className="h-3 w-3" /></button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 px-5 py-8 text-center">
            <p className="text-sm font-semibold text-gray-700">No grocery markdowns are listed right now.</p>
            <button type="button" onClick={() => onNavigate('search', 'groceries')} className="inline-flex items-center gap-2 border border-emerald-800 px-4 py-2 text-xs font-bold text-emerald-900 hover:bg-emerald-50">Browse grocery prices <ArrowRight className="h-3.5 w-3.5" /></button>
          </div>
        )}
        <p className="border-t border-gray-100 px-4 py-2 text-[10px] text-gray-400">Catalogue markdowns can change; confirm the current price with the retailer.</p>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Shoprite & Boxer 5-day specials</h2>
            <p className="mt-1 text-xs text-gray-500">Separate bundles and totals use each store's catalogue prices. Catalogue specials are not live-verified till promotions.</p>
            {groceryPriceRefreshStatus && <p aria-live="polite" className="mt-1 text-xs text-emerald-800">{groceryPriceRefreshStatus}</p>}
          </div>
          {grocerySpecialsActive && <span className="border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900">Ends {grocerySpecialExpiryLabel}</span>}
        </div>
        {grocerySpecialsActive ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {comboDeals.map((combo) => {
              const total = combo.items.reduce((sum, product) => sum + product.priceZar, 0);
              const savings = combo.items.reduce((sum, product) => sum + Math.max(0, (product.originalPriceZar || product.priceZar) - product.priceZar), 0);
              const regularTotal = combo.items.reduce((sum, product) => sum + (product.originalPriceZar || product.priceZar), 0);
              const storeStyle = combo.store === 'Shoprite' ? 'border-rose-200 bg-rose-50 text-rose-900' : 'border-sky-200 bg-sky-50 text-sky-900';
              return (
                <article key={combo.id} className="group overflow-hidden border border-gray-200 bg-white transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between gap-3 border-b border-gray-100 p-4 sm:p-5">
                    <div className="min-w-0">
                      <span className={`inline-flex border px-2 py-1 text-[10px] font-black uppercase ${storeStyle}`}>{combo.store}</span>
                      <h3 className="mt-2 text-base font-black text-gray-900">{combo.title}</h3>
                      <p className="mt-1 text-[11px] text-gray-500">{combo.items.length} everyday essentials · 5-day catalogue offer</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="block text-xl font-black text-emerald-800">{formatPrice(total, currency)}</span>
                      <span className="text-[10px] font-semibold text-gray-500">bundle total</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 sm:p-4">
                    {combo.items.map((product) => (
                      <div key={product.id} className="overflow-hidden border border-gray-100 bg-gray-50">
                        <div className="aspect-[4/3] bg-white">
                          <ProductImage product={product} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
                        </div>
                        <div className="p-2">
                          <p className="line-clamp-2 min-h-8 text-[10px] font-semibold leading-snug text-gray-700" title={product.title}>{product.title}</p>
                          <p className="mt-1 text-xs font-black text-gray-900">{formatPrice(product.priceZar, currency)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mx-4 flex items-center justify-between gap-3 border-t border-dashed border-gray-200 py-3 text-[11px] sm:mx-5">
                    <span className="text-gray-500">Regular catalogue total <span className="font-semibold text-gray-700">{formatPrice(regularTotal, currency)}</span></span>
                    {savings > 0 ? <span className="shrink-0 bg-amber-100 px-2 py-1 font-black text-amber-950">Save {formatPrice(savings, currency)}</span> : <span className="shrink-0 text-gray-500">Catalogue bundle</span>}
                  </div>
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                    <button type="button" onClick={() => onAddComboToShoppingList(combo.items.map((product) => product.title))} className="inline-flex w-full items-center justify-center gap-2 bg-emerald-800 px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-emerald-900">
                      <ShoppingCart className="h-4 w-4" /> Add full bundle to shopping list
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="border border-gray-200 bg-white p-5 text-sm text-gray-600">These five-day catalogue specials have expired. Check the stores for their current offers.</p>
        )}
        {twoForTwentyDeals.length > 0 && (
          <div className="border border-amber-200 bg-amber-50 p-4">
            <h3 className="text-sm font-bold text-amber-950">Two for under R20</h3>
            <p className="mt-1 text-xs text-amber-900">Based on two units at the current catalogue price, not a retailer's till promotion.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {twoForTwentyDeals.map((product) => <button key={product.id} type="button" onClick={() => onAddComboToShoppingList([product.title, product.title])} className="border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-amber-100">2 × {product.title} · {formatPrice(product.priceZar * 2, currency)}</button>)}
            </div>
          </div>
        )}
      </section>

      {foodLoversFreshProducts.length > 0 && (
        <section className="border border-green-200 bg-white p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Fresh at Food Lover's Market</h2>
              <p className="mt-1 text-xs text-gray-500">Fruit, vegetables, and fresh grocery catalogue items.</p>
            </div>
            <button type="button" onClick={() => onNavigate('search', 'fresh produce')} className="text-xs font-semibold text-emerald-800 hover:underline">Search Food Lover's Market</button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {foodLoversFreshProducts.map((product) => (
              <article key={product.id} className="border border-gray-100 p-3">
                <div className="mb-3 aspect-square overflow-hidden bg-gray-50">
                  <ProductImage product={product} className="h-full w-full object-cover" />
                </div>
                <h3 className="line-clamp-2 min-h-9 text-xs font-semibold text-gray-900">{product.title}</h3>
                <p className="mt-1 text-xs font-bold text-emerald-800">{formatPrice(product.priceZar, currency)}</p>
                <button type="button" onClick={() => onAddComboToShoppingList([product.title])} className="mt-2 w-full border border-gray-200 px-2 py-2 text-[10px] font-bold text-gray-700 hover:bg-green-50">Add to list</button>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Featured Deals & Price Drops Across SA Retail Stores */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-emerald-600" />
              Student Price Drops
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Discounts in the current catalogue; retailer prices may change.
            </p>
          </div>
          <button
            onClick={() => onNavigate('search')}
            className="text-xs font-semibold text-[#135d38] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Deals</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((product) => {
            const isTracked = trackedProductIds.has(product.id);
            return (
              <div
                key={product.id}
                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Badges row */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700 uppercase tracking-wide">
                      {product.store}
                    </span>
                    {product.discountPercent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        -{product.discountPercent}%
                      </span>
                    )}
                  </div>

                  {/* Product Image */}
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-gray-50 mb-3">
                    <ProductImage
                      product={product}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => onToggleTrack(product)}
                      className={`absolute top-2 right-2 p-1.5 rounded-full transition-all cursor-pointer ${
                        isTracked
                          ? 'bg-red-50 text-red-500 shadow-xs'
                          : 'bg-white/80 backdrop-blur-xs text-gray-400 hover:text-red-500'
                      }`}
                      title={isTracked ? 'Tracking item' : 'Track price drop'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isTracked ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                  </div>

                  {/* Title & info */}
                  <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 mb-1" title={product.title}>
                    {product.title}
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">{product.unit || product.brand}</p>
                </div>

                {/* Price & Action */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-bold text-base text-gray-900">
                        {formatPrice(product.priceZar, currency)}
                      </span>
                      {product.originalPriceZar && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(product.originalPriceZar, currency)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleTrack(product)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                      isTracked
                        ? 'bg-emerald-100 text-[#135d38] font-bold'
                        : 'bg-gray-100 hover:bg-[#135d38] hover:text-white text-gray-700'
                    }`}
                  >
                    <Bell className="w-3 h-3" />
                    <span>{isTracked ? 'Tracking' : 'Track'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grocery Basket Callout Banner */}
      <div className="bg-emerald-900 text-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-800/80 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-300" />
            <span>Student Staple Basket Index</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-white">
            Compare 10 Essential Groceries Across Checkers, PnP & Woolies
          </h3>
          <p className="text-emerald-100/80 text-xs sm:text-sm max-w-xl">
            See exactly which South African supermarket gives you the cheapest total cart for bread, milk, eggs, rice, chicken and coffee this week.
          </p>
        </div>
        <button
          onClick={() => onNavigate('pricewatch')}
          className="bg-white text-[#135d38] hover:bg-emerald-50 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-xs shrink-0 cursor-pointer"
        >
          View Basket Comparison →
        </button>
      </div>

      {/* Footer (Matching Screenshot 1) */}
      <footer className="pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <p>© 2026 SmartShopper AI. Built for South African students.</p>
        <div className="flex items-center gap-6">
          <button onClick={() => onNavigate('pricewatch')} className="hover:text-gray-900 cursor-pointer">
            Student Resources
          </button>
          <button onClick={() => onNavigate('dashboard')} className="hover:text-gray-900 cursor-pointer">
            Budget Guides
          </button>
          <span className="hover:text-gray-900 cursor-pointer">Terms of Service</span>
          <span className="hover:text-gray-900 cursor-pointer">Privacy Policy</span>
        </div>
      </footer>
    </div>
  );
};
