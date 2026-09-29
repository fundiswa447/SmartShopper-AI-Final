import React, { useMemo, useState } from 'react';
import { AlertTriangle, ListChecks, MapPin, Percent, Search, ShoppingCart, Sparkles, Store, Tag, Wallet, Trash2, Plus } from 'lucide-react';
import { Currency, Product, UserProfile } from '../types';
import { formatPrice } from '../data/mockData';
import { ProductImage } from './ProductImage';

interface ShoppingListScreenProps {
  products: Product[];
  currency: Currency;
  onToggleTrack: (product: Product) => void;
  trackedProductIds: Set<string>;
  shoppingListQuery?: string;
  onShoppingListQueryChange?: (query: string) => void;
  onOpenTripReceipt?: (items: Array<{
    id: string;
    name: string;
    quantity: number;
    priceZar: number;
    store?: string;
    completed: boolean;
  }>) => void;
  budgetRemainingZar?: number;
  monthlyBudgetZar: number;
  profile: UserProfile;
}

interface BasketStore {
  store: string;
  products: Product[];
  total: number;
  distance: number;
  saleCount: number;
}

interface CompleteStoreBasket {
  store: string;
  products: Product[];
  total: number;
  distance?: number;
  nearbyStore?: { id: string; name: string; address: string; distanceKm: number; openingHours?: string };
}

interface NearbyBranchSuggestion {
  branch: NearbyListStore;
  items: Array<{
    requestedItem: string;
    product: Product;
    quantity: number;
  }>;
  total: number;
}

const normalise = (value: string) => value.toLowerCase().replace(/[^a-z0-9 ]/g, ' ');

const productMatchesItem = (product: Product, item: string) => {
  const cleanItem = item.replace(/\s+(?:x|×)\s*\d+\s*$/i, '');
  const itemWords = normalise(cleanItem).split(/\s+/).filter((word) => word.length > 2);
  const searchableText = normalise(
    `${product.title} ${product.brand} ${product.subcategory || ''}`
  );

  return itemWords.length > 0 && itemWords.every((word) => searchableText.includes(word));
};

const normalizeStoreName = (name: string) => name
  .toLowerCase()
  .replace(/pick\s*n\s*pay|p\s*&\s*np/g, 'pnp')
  .replace(/[^a-z0-9]/g, '')
  .replace(/food|hyper|supermarket|express|sixty60|asap/g, '');

const storesMatch = (first: string, second: string) => {
  const a = normalizeStoreName(first);
  const b = normalizeStoreName(second);
  return a === b || a.includes(b) || b.includes(a);
};

const getQuantity = (item: string) => Number(item.match(/(?:x|×)\s*(\d+)\s*$/i)?.[1] || 1);

interface NearbyListStore {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  openingHours?: string;
}

export const ShoppingListScreen: React.FC<ShoppingListScreenProps> = ({
  products,
  currency,
  onToggleTrack,
  trackedProductIds,
  shoppingListQuery,
  onShoppingListQueryChange,
  onOpenTripReceipt,
  budgetRemainingZar = 0,
  monthlyBudgetZar,
  profile,
}) => {
  const [listText, setListText] = useState(shoppingListQuery || '');
  const [quickItem, setQuickItem] = useState('');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [submittedItems, setSubmittedItems] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [nearbyStores, setNearbyStores] = useState<NearbyListStore[]>([]);
  const [nearbyMessage, setNearbyMessage] = useState('');
  const [loadingNearby, setLoadingNearby] = useState(false);

  React.useEffect(() => {
    let active = true;
    const load = async () => {
      setLoadingNearby(true);
      try {
        let latitude = profile.latitude;
        let longitude = profile.longitude;
        if ((latitude === undefined || longitude === undefined) && profile.location?.trim()) {
          const geocode = await fetch(`/api/location/geocode?q=${encodeURIComponent(profile.location.trim())}`);
          if (!geocode.ok) throw new Error('Could not find the saved location.');
          const point = await geocode.json() as { latitude: number; longitude: number };
          latitude = point.latitude;
          longitude = point.longitude;
        }
        if (latitude === undefined || longitude === undefined) {
          if (active) setNearbyMessage('Add your shopping location in Profile to see nearby complete-basket options.');
          return;
        }
        const response = await fetch(`/api/nearby-stores?lat=${latitude}&lon=${longitude}`);
        if (!response.ok) throw new Error('Nearby stores could not be loaded.');
        const result = await response.json() as { stores: NearbyListStore[] };
        if (!active) return;
        setNearbyStores(result.stores);
        setNearbyMessage(result.stores.length ? 'Nearby stores based on your saved location.' : 'No nearby stores were found.');
      } catch (error) {
        if (active) setNearbyMessage(error instanceof Error ? error.message : 'Nearby stores could not be loaded.');
      } finally {
        if (active) setLoadingNearby(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [profile.latitude, profile.longitude, profile.location]);

  React.useEffect(() => {
    if (shoppingListQuery && shoppingListQuery !== listText) {
      setListText(shoppingListQuery);
      const nextItems = Array.from(
        new Set(
          shoppingListQuery
            .split(/[\n,]/)
            .map((item) => item.trim())
            .filter(Boolean)
        )
      );
      setSubmittedItems(nextItems);
      setHasSearched(nextItems.length > 0);
    }
  }, [shoppingListQuery, listText]);

  const completeStoreBaskets = useMemo<CompleteStoreBasket[]>(() => {
    if (!submittedItems.length) return [];
    const candidatesByItem = submittedItems.map((item) => products.filter(
      (product) => product.inStock && productMatchesItem(product, item)
    ));
    if (candidatesByItem.some((candidates) => candidates.length === 0)) return [];
    const firstStores = Array.from(new Set(candidatesByItem[0].map((product) => product.store)));
    return firstStores.flatMap((store) => {
      const basketProducts = candidatesByItem.map((candidates) => candidates
        .filter((product) => product.store === store)
        .sort((first, second) => first.priceZar - second.priceZar)[0]
      );
      if (basketProducts.some((product) => !product)) return [];
      const selectedProducts = basketProducts as Product[];
      const total = selectedProducts.reduce((sum, product, index) => sum + product.priceZar * getQuantity(submittedItems[index]), 0);
      const nearbyStore = nearbyStores.find((nearby) => storesMatch(store, nearby.name));
      return [{
        store,
        products: selectedProducts,
        total,
        ...(nearbyStore ? { nearbyStore, distance: nearbyStore.distanceKm } : {}),
      }];
    }).sort((first, second) => first.total - second.total);
  }, [products, submittedItems, nearbyStores]);
  const nearbyCompleteStoreBaskets = completeStoreBaskets.filter((basket) => basket.nearbyStore);

  const storeRecommendations = useMemo<BasketStore[]>(() => completeStoreBaskets.map((basket) => ({
    store: basket.store,
    products: basket.products,
    total: basket.total,
    distance: basket.distance ?? 99,
    saleCount: basket.products.filter((product) => product.discountPercent).length,
  })), [completeStoreBaskets]);

  const nearbyBranchSuggestions = useMemo<NearbyBranchSuggestion[]>(() => {
    if (!submittedItems.length || !nearbyStores.length) return [];
    const byBranch = new Map<string, NearbyBranchSuggestion>();

    submittedItems.forEach((requestedItem) => {
      const productsForItem = products.filter((product) =>
        product.inStock && productMatchesItem(product, requestedItem)
      );
      nearbyStores.forEach((branch) => {
        const branchProducts = productsForItem
          .filter((product) => storesMatch(product.store, branch.name))
          .sort((first, second) => first.priceZar - second.priceZar);
        const cheapest = branchProducts[0];
        if (!cheapest) return;

        const suggestion = byBranch.get(branch.id) || { branch, items: [], total: 0 };
        const existingItemIndex = suggestion.items.findIndex((item) => item.requestedItem === requestedItem);
        if (existingItemIndex === -1) {
          const quantity = getQuantity(requestedItem);
          suggestion.items.push({ requestedItem, product: cheapest, quantity });
          suggestion.total += cheapest.priceZar * quantity;
        }
        byBranch.set(branch.id, suggestion);
      });
    });

    return Array.from(byBranch.values()).sort((first, second) =>
      second.items.length - first.items.length ||
      first.branch.distanceKm - second.branch.distanceKm ||
      first.total - second.total
    );
  }, [nearbyStores, products, submittedItems]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const items = Array.from(
      new Set(
        listText
          .split(/[\n,]/)
          .map((item) => item.trim())
          .filter(Boolean)
      )
    );

    onShoppingListQueryChange?.(listText);
    setSubmittedItems(items);
    setHasSearched(true);
  };

  const cheapestTotal = completeStoreBaskets[0]?.total || 0;
  const editableItems = Array.from(new Set(listText.split(/[\n,]/).map((item) => item.trim()).filter(Boolean)));

  React.useEffect(() => {
    const isOverBudget = hasSearched && monthlyBudgetZar > 0 && cheapestTotal > budgetRemainingZar;
    setIsBudgetDialogOpen(isOverBudget);
  }, [hasSearched, monthlyBudgetZar, cheapestTotal, budgetRemainingZar]);

  const addQuickItem = () => {
    const item = quickItem.trim();
    if (!item) return;
    const nextText = listText.trim() ? `${listText.trim()}\n${item}` : item;
    setListText(nextText);
    onShoppingListQueryChange?.(nextText);
    setQuickItem('');
  };

  const removeListItem = (itemToRemove: string) => {
    const nextItems = editableItems.filter((item) => item !== itemToRemove);
    const nextText = nextItems.join('\n');
    setListText(nextText);
    setSubmittedItems((previous) => previous.filter((item) => item !== itemToRemove));
    setCheckedItems((previous) => {
      const next = new Set(previous);
      next.delete(itemToRemove);
      return next;
    });
    onShoppingListQueryChange?.(nextText);
  };

  const openReceiptForBasket = (basket: CompleteStoreBasket) => {
    if (!onOpenTripReceipt) return;
    onOpenTripReceipt(basket.products.map((product, index) => ({
      id: product.id,
      name: product.title,
      quantity: getQuantity(submittedItems[index]),
      priceZar: product.priceZar,
      store: basket.store,
      completed: true,
    })));
  };

  const openReceiptForNearbyBranch = (suggestion: NearbyBranchSuggestion) => {
    if (!onOpenTripReceipt) return;
    onOpenTripReceipt(suggestion.items.map(({ product, quantity }) => ({
      id: product.id,
      name: product.title,
      quantity,
      priceZar: product.priceZar,
      store: suggestion.branch.name,
      completed: true,
    })));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <header className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800">
          <Sparkles className="w-3.5 h-3.5" />
          Basket intelligence
        </div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
          Build your shopping list once.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          Add what you need and SmartShopper will compare the best matching prices, nearby stores, and current sales for your basket.
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)] gap-6 items-start">
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ListChecks className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">What are you buying?</h2>
              <p className="text-xs text-gray-500">One item per line or separate items with commas.</p>
            </div>
          </div>

          <textarea
            id="shopping-list-items"
            value={listText}
            onChange={(event) => setListText(event.target.value)}
            placeholder={'Milk\nBread\nChicken\nSneakers'}
            rows={7}
            className="w-full resize-y rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            aria-label="Shopping list items"
          />

          <div className="mt-3 flex gap-2">
            <input
              value={quickItem}
              onChange={(event) => setQuickItem(event.target.value)}
              placeholder="Add one item"
              aria-label="Add a shopping list item"
              className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600"
            />
            <button type="button" onClick={addQuickItem} disabled={!quickItem.trim()} className="inline-flex items-center gap-2 rounded-xl border border-emerald-800 px-4 py-2 text-xs font-bold text-emerald-900 hover:bg-emerald-50 disabled:opacity-40">
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>

          {editableItems.length > 0 && (
            <div className="mt-5 border-t border-gray-100 pt-4">
              <h3 className="mb-2 text-xs font-bold uppercase text-gray-500">Shopping checklist · {editableItems.length}</h3>
              <ul className="divide-y divide-gray-100">
                {editableItems.map((item) => (
                  <li key={item} className="flex items-center gap-3 py-2.5">
                    <input
                      type="checkbox"
                      checked={checkedItems.has(item)}
                      onChange={(event) => setCheckedItems((previous) => {
                        const next = new Set(previous);
                        if (event.target.checked) next.add(item);
                        else next.delete(item);
                        return next;
                      })}
                      aria-label={`Check ${item}`}
                      className="h-4 w-4 accent-emerald-800"
                    />
                    <span className={`min-w-0 flex-1 text-sm ${checkedItems.has(item) ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{item}</span>
                    <button type="button" onClick={() => removeListItem(item)} aria-label={`Delete ${item}`} title="Delete item" className="p-1 text-gray-400 hover:text-rose-700"><Trash2 className="h-4 w-4" /></button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-gray-400">Try groceries, clothing, tech, or any product name.</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setListText('');
                  setSubmittedItems([]);
                  setCheckedItems(new Set());
                  setHasSearched(false);
                  onShoppingListQueryChange?.('');
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 transition hover:border-gray-300"
              >
                Clear search
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#135d38] px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#0f4d2e]"
              >
                <Search className="w-4 h-4" />
                Compare my list
              </button>
            </div>
          </div>
        </form>

        <aside className="rounded-3xl bg-gradient-to-br from-teal-800 to-emerald-950 p-6 text-white shadow-xs">
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wider">
            <ShoppingCart className="w-4 h-4" />
            How it works
          </div>
          <div className="mt-5 space-y-5">
            <div className="flex gap-3">
              <span className="flex w-7 h-7 shrink-0 items-center justify-center rounded-full bg-amber-300 text-xs font-black text-amber-950">1</span>
              <p className="text-sm text-emerald-50/85">Write your full list instead of searching for products one at a time.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex w-7 h-7 shrink-0 items-center justify-center rounded-full bg-rose-300 text-xs font-black text-rose-950">2</span>
              <p className="text-sm text-emerald-50/85">We match your items to products with current prices and discounts.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex w-7 h-7 shrink-0 items-center justify-center rounded-full bg-cyan-300 text-xs font-black text-cyan-950">3</span>
              <p className="text-sm text-emerald-50/85">Choose the cheapest basket or the closest store for your trip.</p>
            </div>
          </div>
        </aside>
      </section>

      {hasSearched && (
        <section className="space-y-5">
          {cheapestTotal > 0 && monthlyBudgetZar > 0 && cheapestTotal > budgetRemainingZar && (
            <div role="alert" className="flex items-start gap-3 border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
              <Wallet className="mt-0.5 h-4 w-4 shrink-0" />
              <p><strong>Budget warning.</strong> Your cheapest matching basket ({formatPrice(cheapestTotal, currency)}) is above your remaining budget ({formatPrice(budgetRemainingZar, currency)}). You can still plan the trip; review your spending before buying.</p>
            </div>
          )}
          {cheapestTotal > 0 && monthlyBudgetZar <= 0 && (
            <div role="status" className="flex items-start gap-3 border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
              <Wallet className="mt-0.5 h-4 w-4 shrink-0" />
              <p><strong>No budget set.</strong> You can still add items, compare stores, plan your trip, and save your shopping list. Set a monthly budget whenever you’re ready to track spending.</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recommendations for your list</h2>
              <p className="mt-1 text-xs text-gray-500">
                {storeRecommendations.length} stores can supply every item on your list
              </p>
            </div>
            {submittedItems.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {submittedItems.map((item) => (
                  <span key={item} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">{item}</span>
                ))}
              </div>
            )}
          </div>

          {completeStoreBaskets.length > 0 && (
            <section className="border border-emerald-200 bg-white p-5 sm:p-6">
              <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-base font-bold text-gray-900">One store for your whole list</h2>
                  <p className="mt-1 text-xs text-gray-500">Every option below has a catalogue match for all {submittedItems.length} requested items.</p>
                </div>
                <span className="text-xs text-gray-500">{loadingNearby ? 'Checking nearby stores…' : nearbyMessage}</span>
              </div>
              {nearbyStores.length > 0 && completeStoreBaskets.every((basket) => !basket.nearbyStore) && (
                <p className="mt-3 border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">Nearby shops were found, but none match a store with a complete catalogue basket. You can still compare the full-list prices below and select a nearby shop in the trip planner.</p>
              )}
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {completeStoreBaskets.map((basket, index) => (
                  <article key={basket.store} className={`border p-4 ${index === 0 ? 'border-emerald-600 bg-emerald-50/50' : 'border-gray-200'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">{basket.store}</h3>
                        <p className="mt-1 text-[11px] text-gray-500">{basket.nearbyStore ? `${basket.nearbyStore.name} · ${basket.distance?.toFixed(1)} km away` : 'No matching nearby branch found'}</p>
                        {basket.nearbyStore && <p className="mt-1 text-[11px] text-gray-600">Opening hours (local time): {basket.nearbyStore.openingHours || 'Not listed on OpenStreetMap'}</p>}
                      </div>
                      {index === 0 && <span className="bg-emerald-800 px-2 py-1 text-[9px] font-bold text-white">LOWEST TOTAL</span>}
                    </div>
                    <p className="mt-4 text-2xl font-black text-gray-900">{formatPrice(basket.total, currency)}</p>
                    <p className="text-[11px] text-gray-500">all list items · before transport</p>
                    <button type="button" onClick={() => openReceiptForBasket(basket)} className="mt-4 w-full border border-emerald-800 px-3 py-2.5 text-xs font-bold text-emerald-900 hover:bg-emerald-100">
                      {basket.nearbyStore ? `Choose nearby ${basket.nearbyStore.name}` : 'Plan this store'}
                    </button>
                  </article>
                ))}
              </div>
              {completeStoreBaskets.length > 0 && onOpenTripReceipt && (
                <button type="button" onClick={() => openReceiptForBasket(completeStoreBaskets[0])} className="mt-4 inline-flex items-center justify-center gap-2 bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900">
                  <Wallet className="h-4 w-4" /> Save more · choose {completeStoreBaskets[0].store} at {formatPrice(completeStoreBaskets[0].total, currency)}
                </button>
              )}
            </section>
          )}

          {nearbyCompleteStoreBaskets.length === 0 && submittedItems.length > 0 && (
            <section className="border border-cyan-200 bg-white p-5 sm:p-6">
              <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Nearby stores with list items</h2>
                  <p className="mt-1 text-xs text-gray-500">No nearby branch has a catalogue match for the whole list. These nearby stores are matched to the products each one carries.</p>
                </div>
                <span className="text-xs text-gray-500">{loadingNearby ? 'Finding nearby branches…' : nearbyMessage}</span>
              </div>

              {nearbyBranchSuggestions.length > 0 ? (
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {nearbyBranchSuggestions.map((suggestion) => (
                    <article key={suggestion.branch.id} className="border border-gray-200 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-bold text-gray-900">{suggestion.branch.name}</h3>
                          <p className="mt-1 text-[11px] text-gray-500">{suggestion.branch.distanceKm.toFixed(1)} km away · matches {suggestion.items.length} of {submittedItems.length}</p>
                        </div>
                        <MapPin className="h-4 w-4 shrink-0 text-cyan-700" />
                      </div>
                      <p className="mt-3 text-xl font-black text-gray-900">{formatPrice(suggestion.total, currency)}</p>
                      <p className="text-[10px] text-gray-500">matched items at this branch</p>
                      <ul className="mt-3 divide-y divide-gray-100">
                        {suggestion.items.map(({ requestedItem, product, quantity }) => (
                          <li key={requestedItem} className="flex justify-between gap-3 py-2 text-xs">
                            <span className="min-w-0">
                              <span className="block truncate font-semibold text-gray-800">{requestedItem}</span>
                              <span className="block truncate text-[10px] text-gray-500">{product.title}{quantity > 1 ? ` · ${quantity} units` : ''}</span>
                            </span>
                            <span className="shrink-0 font-bold text-gray-800">{formatPrice(product.priceZar * quantity, currency)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 flex flex-col gap-2">
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${suggestion.branch.latitude},${suggestion.branch.longitude}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 border border-gray-200 px-3 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                          <MapPin className="h-3.5 w-3.5" /> Directions to this store
                        </a>
                        <button type="button" onClick={() => openReceiptForNearbyBranch(suggestion)} className="border border-emerald-800 px-3 py-2.5 text-xs font-bold text-emerald-900 hover:bg-emerald-50">
                          Plan {suggestion.items.length} item{suggestion.items.length === 1 ? '' : 's'} at this store
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-4 border border-dashed border-gray-200 p-5 text-center text-sm text-gray-600">
                  {loadingNearby
                    ? 'Looking for shops near your saved location…'
                    : nearbyStores.length === 0
                      ? 'Save a location in Profile to find branches near you.'
                      : 'Nearby branches were found, but none could be matched to the catalogue items. Try different item names or refresh your location.'}
                </p>
              )}

              {nearbyBranchSuggestions.length > 0 && (() => {
                const matchedRequests = new Set(nearbyBranchSuggestions.flatMap((suggestion) => suggestion.items.map((item) => item.requestedItem)));
                const unavailableItems = submittedItems.filter((item) => !matchedRequests.has(item));
                return unavailableItems.length > 0 ? (
                  <p className="mt-4 text-xs text-amber-800">No nearby catalogue match found for: {unavailableItems.join(', ')}.</p>
                ) : null;
              })()}
            </section>
          )}

          {storeRecommendations.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <Search className="mx-auto h-8 w-8 text-gray-300" />
              <h3 className="mt-3 text-sm font-bold text-gray-900">No single store has every item</h3>
              <p className="mt-1 text-xs text-gray-500">Try a simpler product name or remove an unmatched item to compare complete baskets.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {storeRecommendations.map((recommendation, index) => (
                <article key={recommendation.store} className={`rounded-3xl border bg-white p-5 shadow-xs ${index === 0 ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-gray-100'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                        <Store className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">{recommendation.store}</h3>
                        <p className="text-[11px] text-gray-500">{recommendation.distance < 99 ? `${recommendation.distance} km away` : 'Online option'}</p>
                      </div>
                    </div>
                    {index === 0 && <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-800">CHEAPEST</span>}
                  </div>

                  <div className="mt-5 flex items-end justify-between border-b border-gray-100 pb-4">
                    <div>
                      <p className="text-[11px] text-gray-400">Matched basket</p>
                      <p className="text-2xl font-black text-gray-900">{formatPrice(recommendation.total, currency)}</p>
                    </div>
                    <div className="text-right text-[11px] text-gray-500">{recommendation.products.length} items</div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {recommendation.products.map((product) => (
                      <div key={product.id} className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100"><ProductImage product={product} className="h-full w-full object-cover" /></div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-gray-800">{product.title}</p>
                          <div className="flex items-center gap-2 text-[10px] text-gray-400">
                            <span>{formatPrice(product.priceZar, currency)}</span>
                            {product.discountPercent && <span className="font-bold text-rose-600">-{product.discountPercent}% sale</span>}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => onToggleTrack(product)}
                          className={`shrink-0 rounded-full p-1.5 ${trackedProductIds.has(product.id) ? 'bg-rose-50 text-rose-600' : 'bg-gray-100 text-gray-400 hover:text-rose-600'}`}
                          aria-label={trackedProductIds.has(product.id) ? `Stop tracking ${product.title}` : `Track ${product.title}`}
                        >
                          <Tag className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                    {recommendation.saleCount > 0 && <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-1 text-[10px] font-semibold text-rose-700"><Percent className="h-3 w-3" /> {recommendation.saleCount} sale{recommendation.saleCount > 1 ? 's' : ''}</span>}
                    {recommendation.distance < 99 && <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2 py-1 text-[10px] font-semibold text-cyan-700"><MapPin className="h-3 w-3" /> Nearby</span>}
                  </div>
                </article>
              ))}
            </div>
          )}

          {cheapestTotal > 0 && (
            <div className="flex flex-col gap-3 rounded-2xl bg-amber-50 border border-amber-100 px-4 py-3 text-xs text-amber-900 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Wallet className="h-4 w-4 shrink-0 text-amber-700" />
                <span>
                  Your cheapest matching basket starts at <strong>{formatPrice(cheapestTotal, currency)}</strong>. Prices are based on the current catalogue and marked sales.
                </span>
              </div>
              {onOpenTripReceipt && completeStoreBaskets.length === 0 && <span className="font-semibold">No one-store complete basket is available for this list.</span>}
            </div>
          )}
        </section>
      )}
      {isBudgetDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6" role="presentation">
          <section role="alertdialog" aria-modal="true" aria-labelledby="overspend-dialog-title" className="w-full max-w-md border border-rose-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-700" />
              <div>
                <h2 id="overspend-dialog-title" className="text-lg font-black text-gray-900">You’re overspending your budget</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">Your cheapest basket is {formatPrice(cheapestTotal, currency)}, but you have {formatPrice(budgetRemainingZar, currency)} remaining. Delete some items from your list to bring it within budget.</p>
              </div>
            </div>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setIsBudgetDialogOpen(false)} className="border border-gray-300 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">Continue anyway</button>
              <button type="button" onClick={() => {
                setIsBudgetDialogOpen(false);
                document.getElementById('shopping-list-items')?.focus();
              }} className="bg-rose-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-rose-800">Edit shopping list</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
