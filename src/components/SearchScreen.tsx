import React, { useEffect, useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Heart,
  Loader2,
  ArrowRight,
  RotateCcw,
  ShoppingCart,
  Store,
} from 'lucide-react';

import { Currency, Product } from '../types';
import { ProductImage } from './ProductImage';
import { formatPrice, searchProducts } from '../data/mockData';
import { searchRealtimePrices } from '../services/geminiService';

interface SearchScreenProps {
  currency: Currency;
  remainingBudgetZar: number;
  initialQuery?: string;
  initialMaxBudget?: number;
  products: Product[];
  onToggleTrack: (p: Product) => void;
  trackedProductIds: Set<string>;
  onAddProducts: (newProds: Product[]) => void;
  onAddToShoppingList: (product: Product) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  currency,
  remainingBudgetZar,
  initialQuery = '',
  initialMaxBudget,
  products,
  onToggleTrack,
  trackedProductIds,
  onAddProducts,
  onAddToShoppingList,
}) => {
  const [query, setQuery] = useState(initialQuery);

  const [minPrice, setMinPrice] = useState<number | ''>('');

  const [maxPrice, setMaxPrice] = useState<number | ''>(
    typeof initialMaxBudget === 'number'
      ? initialMaxBudget
      : ''
  );

  const [selectedCategories, setSelectedCategories] =
    useState<string[]>([]);

  const [selectedStores, setSelectedStores] =
    useState<string[]>([]);

  const [sortBy, setSortBy] = useState<
    'relevance' | 'price-asc' | 'price-desc' | 'discount'
  >('relevance');

  const [isAiSearching, setIsAiSearching] =
    useState(false);

  const [aiTip, setAiTip] =
    useState<string | null>(null);

  useEffect(() => {
    setQuery(initialQuery);
    setMaxPrice(initialMaxBudget ?? '');
  }, [initialQuery, initialMaxBudget]);

  // =========================================================
  // AVAILABLE STORES
  // =========================================================
  const availableStores = [
    {
      name: 'Superbalist',
      code: 'SB',
      color: 'bg-indigo-100 text-indigo-800',
    },
    {
      name: 'Takealot',
      code: 'T',
      color: 'bg-blue-100 text-blue-800',
    },
    {
      name: 'Checkers',
      code: 'C',
      color: 'bg-emerald-100 text-emerald-800',
    },
    {
      name: 'Pick n Pay',
      code: 'P',
      color: 'bg-sky-100 text-sky-800',
    },
    {
      name: 'Woolworths',
      code: 'W',
      color: 'bg-stone-100 text-stone-800',
    },
    {
      name: 'Shoprite',
      code: 'SH',
      color: 'bg-red-100 text-red-800',
    },
    {
      name: 'SPAR',
      code: 'S',
      color: 'bg-green-100 text-green-800',
    },
    {
      name: 'Boxer',
      code: 'B',
      color: 'bg-orange-100 text-orange-800',
    },
    {
      name: 'Food Lover\'s Market',
      code: 'FLM',
      color: 'bg-lime-100 text-lime-800',
    },
    {
      name: 'Mr Price',
      code: 'MR',
      color: 'bg-amber-100 text-amber-800',
    },
    {
      name: 'Jet',
      code: 'J',
      color: 'bg-purple-100 text-purple-800',
    },
    {
      name: 'Ackermans',
      code: 'A',
      color: 'bg-pink-100 text-pink-800',
    },
    {
      name: 'PEP',
      code: 'PE',
      color: 'bg-yellow-100 text-yellow-800',
    },
    {
      name: 'Cotton On',
      code: 'CO',
      color: 'bg-cyan-100 text-cyan-800',
    },
    {
      name: 'Makro',
      code: 'M',
      color: 'bg-orange-100 text-orange-800',
    },
    {
      name: 'Game',
      code: 'G',
      color: 'bg-slate-100 text-slate-800',
    },
  ];

  // =========================================================
  // AVAILABLE CATEGORIES
  // =========================================================
  const availableCategories = [
    'Groceries',
    'Footwear',
    'Clothing',
    'Cosmetics',
    'Electronics',
    'Tech',
    'Essentials',
    'Snacks',
  ];

  // =========================================================
  // SAFE PRICE
  // =========================================================
  const safePrice = (value: unknown): number => {
    const numberValue = Number(value);

    if (!Number.isFinite(numberValue)) {
      return 0;
    }

    return Math.max(0, numberValue);
  };

  // =========================================================
  // AI / REAL-TIME SEARCH
  // =========================================================
  const handleSearchSubmit = async (
    e?: React.FormEvent
  ) => {
    e?.preventDefault();

    const cleanQuery = query.trim();

    if (!cleanQuery) {
      return;
    }

    setIsAiSearching(true);
    setAiTip(null);

    try {
      const res = await searchRealtimePrices({
        query: cleanQuery,

        maxBudget:
          typeof maxPrice === 'number'
            ? maxPrice
            : undefined,

        storeFilter:
          selectedStores.length > 0
            ? selectedStores
            : undefined,
      });

      if (
        res.results &&
        Array.isArray(res.results) &&
        res.results.length > 0
      ) {
        onAddProducts(res.results);
      }

      if (res.summary || res.savingsTip) {
        setAiTip(
          res.savingsTip ||
            res.summary ||
            null
        );
      }
    } catch (err) {
      console.error(
        'AI search failed:',
        err
      );

      setAiTip(
        'Live search could not be completed. Showing products already available in SmartShopper.'
      );
    } finally {
      setIsAiSearching(false);
    }
  };

  // =========================================================
  // RESET FILTERS
  // =========================================================
  const handleResetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedCategories([]);
    setSelectedStores([]);
    setSortBy('relevance');
  };

  // =========================================================
  // CATEGORY TOGGLE
  // =========================================================
  const toggleCategory = (
    category: string
  ) => {
    setSelectedCategories((previous) =>
      previous.includes(category)
        ? previous.filter(
            (item) => item !== category
          )
        : [...previous, category]
    );
  };

  // =========================================================
  // STORE TOGGLE
  // =========================================================
  const toggleStore = (
    storeName: string
  ) => {
    setSelectedStores((previous) =>
      previous.includes(storeName)
        ? previous.filter(
            (store) => store !== storeName
          )
        : [...previous, storeName]
    );
  };

  // =========================================================
  // FILTER + SORT PRODUCTS
  // =========================================================
  const filteredProducts = useMemo(() => {
    return searchProducts(query, products)
      .filter((product) => {
        // -----------------------------------------------
        // CATEGORY
        // -----------------------------------------------
        if (
          selectedCategories.length > 0 &&
          !selectedCategories.includes(
            product.category
          )
        ) {
          return false;
        }

        // -----------------------------------------------
        // STORE
        // -----------------------------------------------
        if (
          selectedStores.length > 0 &&
          !selectedStores.includes(
            product.store
          )
        ) {
          return false;
        }

        // -----------------------------------------------
        // PRICE
        // -----------------------------------------------
        const price = safePrice(
          product.priceZar
        );

        if (
          minPrice !== '' &&
          price < Number(minPrice)
        ) {
          return false;
        }

        if (
          maxPrice !== '' &&
          price > Number(maxPrice)
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = safePrice(
          a.priceZar
        );

        const priceB = safePrice(
          b.priceZar
        );

        if (sortBy === 'price-asc') {
          return priceA - priceB;
        }

        if (sortBy === 'price-desc') {
          return priceB - priceA;
        }

        if (sortBy === 'discount') {
          return (
            (b.discountPercent || 0) -
            (a.discountPercent || 0)
          );
        }

        if (a.category === 'Groceries' && b.category === 'Groceries') {
          return priceA - priceB;
        }

        return 0;
      });
  }, [
    products,
    query,
    selectedCategories,
    selectedStores,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  // =========================================================
  // GROUP SAME PRODUCTS FOR PRICE COMPARISON
  // =========================================================
  const comparisonGroups = useMemo(() => {
    const groups =
      new Map<string, Product[]>();

    filteredProducts.forEach(
      (product) => {
        const comparisonKey = [
          product.brand,
          product.title,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .replace(/\s+/g, ' ')
          .trim();

        const existing =
          groups.get(comparisonKey) || [];

        groups.set(comparisonKey, [
          ...existing,
          product,
        ]);
      }
    );

    return Array.from(
      groups.entries()
    ).map(([key, items]) => ({
      key,
      title: items[0]?.title || key,
      items: [...items].sort(
        (a, b) =>
          safePrice(a.priceZar) -
          safePrice(b.priceZar)
      ),
    }));
  }, [filteredProducts]);

  // =========================================================
  // DISPLAY
  // =========================================================
  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

      {/* =====================================================
          SEARCH BAR
          ===================================================== */}
      <form
        onSubmit={handleSearchSubmit}
        className="relative max-w-3xl"
      >
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-gray-400 absolute left-4" />

          <input
            type="text"
            id="deals-search-input"
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            placeholder="Search products, brands, categories or stores..."
            className="w-full bg-white text-gray-900 text-sm py-3.5 pl-12 pr-14 rounded-full border border-gray-200 focus:border-[#135d38] focus:ring-2 focus:ring-emerald-100 focus:outline-hidden shadow-xs transition-all"
          />

          <button
            type="submit"
            disabled={
              isAiSearching ||
              !query.trim()
            }
            className="absolute right-2 p-2.5 rounded-full bg-[#135d38] hover:bg-[#0f4d2e] text-white transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            title="Search with Gemini AI"
          >
            {isAiSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>

      {/* =====================================================
          AI TIP
          ===================================================== */}
      {aiTip && (
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-900 shadow-2xs">
          <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />

          <div>
            <span className="font-bold text-emerald-950">
              SmartShopper AI Retail Tip:{' '}
            </span>

            <span>{aiTip}</span>
          </div>
        </div>
      )}

      {/* =====================================================
          MAIN TWO COLUMN LAYOUT
          ===================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ===================================================
            FILTER COLUMN
            =================================================== */}
        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-3xl p-6 shadow-xs space-y-6">

          {/* Filter heading */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-600" />

              <h3 className="font-bold text-base text-gray-900">
                Filters
              </h3>
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-[#135d38] hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />

              <span>Reset</span>
            </button>
          </div>

          {/* =================================================
              PRICE RANGE
              ================================================= */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Price Range
            </h4>

            <div className="flex items-center gap-2">

              {/* Minimum */}
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 flex items-center">
                <span className="text-xs text-gray-400 mr-1 font-semibold">
                  {currency === 'ZAR'
                    ? 'R'
                    : '$'}
                </span>

                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => {
                    const value =
                      e.target.value;

                    setMinPrice(
                      value === ''
                        ? ''
                        : Math.max(
                            0,
                            Number(value)
                          )
                    );
                  }}
                  className="w-full text-xs text-gray-900 bg-transparent focus:outline-hidden"
                />
              </div>

              <span className="text-gray-400 text-xs">
                -
              </span>

              {/* Maximum */}
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 flex items-center">
                <span className="text-xs text-gray-400 mr-1 font-semibold">
                  {currency === 'ZAR'
                    ? 'R'
                    : '$'}
                </span>

                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => {
                    const value =
                      e.target.value;

                    setMaxPrice(
                      value === ''
                        ? ''
                        : Math.max(
                            0,
                            Number(value)
                          )
                    );
                  }}
                  className="w-full text-xs text-gray-900 bg-transparent focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* =================================================
              CATEGORIES
              ================================================= */}
          <div className="space-y-2.5 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Category
            </h4>

            {availableCategories.map(
              (category) => {
                const isChecked =
                  selectedCategories.includes(
                    category
                  );

                const count =
                  products.filter(
                    (product) =>
                      product.category ===
                      category
                  ).length;

                return (
                  <label
                    key={category}
                    className="flex items-center justify-between text-xs text-gray-700 hover:text-gray-900 cursor-pointer py-0.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          toggleCategory(
                            category
                          )
                        }
                        className="w-4 h-4 rounded border-gray-300 text-[#135d38] focus:ring-emerald-500 cursor-pointer"
                      />

                      <span
                        className={
                          isChecked
                            ? 'font-semibold text-gray-900'
                            : ''
                        }
                      >
                        {category}
                      </span>
                    </div>

                    <span className="text-gray-400 text-[11px]">
                      ({count})
                    </span>
                  </label>
                );
              }
            )}
          </div>

          {/* =================================================
              STORES
              ================================================= */}
          <div className="space-y-2.5 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Store
            </h4>

            {availableStores.map(
              (store) => {
                const isChecked =
                  selectedStores.includes(
                    store.name
                  );

                const count =
                  products.filter(
                    (product) =>
                      product.store ===
                      store.name
                  ).length;

                return (
                  <label
                    key={store.name}
                    className="flex items-center justify-between text-xs text-gray-700 hover:text-gray-900 cursor-pointer py-0.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          toggleStore(
                            store.name
                          )
                        }
                        className="w-4 h-4 rounded border-gray-300 text-[#135d38] focus:ring-emerald-500 cursor-pointer"
                      />

                      <span
                        className={
                          isChecked
                            ? 'font-semibold text-gray-900'
                            : ''
                        }
                      >
                        {store.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-400 text-[10px]">
                        ({count})
                      </span>

                      <span
                        className={`w-6 h-5 rounded flex items-center justify-center text-[9px] font-bold ${store.color}`}
                      >
                        {store.code}
                      </span>
                    </div>
                  </label>
                );
              }
            )}
          </div>

          {/* =================================================
              PRO TIP
              ================================================= */}
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 text-xs text-emerald-950 shadow-2xs">
            <div className="flex items-center gap-1.5 font-bold text-[#135d38] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />

              <span>Pro Tip</span>
            </div>

            <p className="text-gray-600 text-[11px] leading-relaxed">
              Compare the same product across
              multiple stores before adding it to
              your shopping list. Your shopping list
              uses the selected store price when you
              add the product.
            </p>
          </div>
        </div>

        {/* ===================================================
            RESULTS COLUMN
            =================================================== */}
        <div className="lg:col-span-9 space-y-6">

          {/* Results header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight capitalize">
                {query.trim() ||
                  'All Student Deals'}
              </h2>

              <p className="text-xs text-gray-500 mt-0.5">
                Showing {filteredProducts.length}{' '}
                result
                {filteredProducts.length === 1
                  ? ''
                  : 's'} sorted by {sortBy}
              </p>
            </div>

            <div className="flex items-center gap-3">

              {/* Cheapest option */}
              <button
                type="button"
                onClick={() => {
                  setSortBy('price-asc');

                  if (!query.trim()) {
                    setQuery('');
                  }
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#135d38] text-xs font-semibold border border-emerald-200/60 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />

                <span>
                  Find cheapest option
                </span>
              </button>

              {/* Sort */}
              <select
                id="search-sort-dropdown"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as
                      | 'relevance'
                      | 'price-asc'
                      | 'price-desc'
                      | 'discount'
                  )
                }
                className="bg-white border border-gray-200 text-gray-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-hidden focus:border-[#135d38] cursor-pointer shadow-2xs"
              >
                <option value="relevance">
                  Relevance
                </option>

                <option value="price-asc">
                  Price: Low to High
                </option>

                <option value="price-desc">
                  Price: High to Low
                </option>

                <option value="discount">
                  Biggest Discount
                </option>
              </select>
            </div>
          </div>

          {/* =================================================
              RESULTS
              ================================================= */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center space-y-4">

              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#135d38] mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-gray-900">
                No items match your exact filters
              </h3>

              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Try widening your price range,
                clearing store filters, or use Gemini
                to search South African retail stores
                online.
              </p>

              <button
                type="button"
                onClick={() =>
                  handleSearchSubmit()
                }
                disabled={isAiSearching}
                className="bg-[#135d38] text-white px-5 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 hover:bg-emerald-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isAiSearching ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}

                <span>
                  Search Live Retail Stores with
                  Gemini
                </span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">

              {/* =================================================
                  PRODUCT COMPARISON GROUPS
                  ================================================= */}
              {comparisonGroups.map(
                (group) => {
                  const cheapestProduct =
                    group.items[0];

                  const hasMultipleStores =
                    group.items.length > 1;

                  const cheapestPrice =
                    safePrice(
                      cheapestProduct?.priceZar
                    );

                  const highestPrice =
                    safePrice(
                      group.items[
                        group.items.length - 1
                      ]?.priceZar
                    );

                  const priceDifference =
                    Math.max(
                      0,
                      highestPrice -
                        cheapestPrice
                    );

                  return (
                    <div
                      key={group.key}
                      className="bg-white border border-gray-100 rounded-3xl p-5 shadow-2xs"
                    >

                      {/* Product heading */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">

                        <div>
                          <div className="flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5 text-[#135d38]" />

                            <h3 className="text-lg font-bold text-gray-900">
                              {group.title}
                            </h3>
                          </div>

                          <p className="text-xs text-gray-500 mt-1">
                            {hasMultipleStores
                              ? `Compare ${group.items.length} stores before adding to your list`
                              : 'Available from this store'}
                          </p>
                        </div>

                        {hasMultipleStores && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-[#135d38] border border-emerald-100 text-xs font-bold">
                            <Store className="w-3.5 h-3.5" />

                            Price comparison
                          </span>
                        )}
                      </div>

                      {/* Store cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

                        {group.items.map(
                          (
                            product,
                            index
                          ) => {
                            const productPrice =
                              safePrice(
                                product.priceZar
                              );

                            const originalPrice =
                              safePrice(
                                product.originalPriceZar
                              );

                            const isTracked =
                              trackedProductIds.has(
                                product.id
                              );

                            const fitsBudget =
                              remainingBudgetZar >
                                0 &&
                              productPrice <=
                                remainingBudgetZar;

                            const budgetPercent =
                              remainingBudgetZar >
                              0
                                ? Math.min(
                                    100,
                                    Math.round(
                                      (productPrice /
                                        remainingBudgetZar) *
                                        100
                                    )
                                  )
                                : 0;

                            const isCheapest =
                              index === 0;

                            return (
                              <div
                                key={
                                  product.id
                                }
                                className={`border rounded-2xl p-4 relative transition-all hover:shadow-md ${
                                  isCheapest
                                    ? 'border-emerald-300 bg-emerald-50/30 ring-1 ring-emerald-100'
                                    : 'border-gray-100 bg-gray-50/40'
                                }`}
                              >

                                {/* Cheapest badge */}
                                {isCheapest &&
                                  hasMultipleStores && (
                                    <div className="mb-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#135d38] text-white text-[10px] font-bold">
                                      <Sparkles className="w-3 h-3" />

                                      Cheapest option
                                    </div>
                                  )}

                                {/* Store */}
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">

                                    <span className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-800 text-[10px] font-bold flex items-center justify-center">
                                      {product.storeCode}
                                    </span>

                                    <span className="text-xs font-bold text-gray-800">
                                      {product.store}
                                    </span>
                                  </div>

                                  {product.discountPercent ? (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                                      -
                                      {
                                        product.discountPercent
                                      }
                                      %
                                    </span>
                                  ) : null}
                                </div>

                                {/* Product image */}
                                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 mb-3">

                                  <ProductImage
                                    product={product}
                                    className="w-full h-full object-cover"
                                  />

                                  {/* Wishlist */}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onToggleTrack(
                                        product
                                      )
                                    }
                                    className={`absolute top-2 right-2 p-1.5 rounded-full transition-all cursor-pointer ${
                                      isTracked
                                        ? 'bg-red-50 text-red-500 shadow-xs'
                                        : 'bg-white/80 backdrop-blur-xs text-gray-400 hover:text-red-500'
                                    }`}
                                    title={
                                      isTracked
                                        ? 'Remove from wishlist'
                                        : 'Add to wishlist'
                                    }
                                  >
                                    <Heart
                                      className={`w-3.5 h-3.5 ${
                                        isTracked
                                          ? 'fill-red-500 text-red-500'
                                          : ''
                                      }`}
                                    />
                                  </button>
                                </div>

                                {/* Brand */}
                                <p className="text-xs text-gray-500 mb-2">
                                  {product.brand}
                                </p>

                                {/* Subcategory */}
                                {product.subcategory && (
                                  <p className="text-[10px] text-gray-400 mb-2">
                                    {
                                      product.subcategory
                                    }
                                  </p>
                                )}

                                {/* Price */}
                                <div className="flex items-end justify-between mb-3">

                                  <div>
                                    <div className="font-black text-xl text-gray-900">
                                      {formatPrice(
                                        productPrice,
                                        currency
                                      )}
                                    </div>

                                    {originalPrice >
                                      productPrice && (
                                      <div className="text-xs text-gray-400 line-through">
                                        {formatPrice(
                                          originalPrice,
                                          currency
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  {isCheapest &&
                                    hasMultipleStores && (
                                      <span className="text-[10px] font-bold text-[#135d38]">
                                        Save more
                                      </span>
                                    )}
                                </div>

                                {/* Unit */}
                                {product.unit && (
                                  <p className="text-[10px] text-gray-400 mb-3">
                                    Unit: {product.unit}
                                  </p>
                                )}

                                {/* Budget indicator */}
                                <div className="flex items-center gap-2 mb-4">

                                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${
                                        fitsBudget
                                          ? 'bg-[#135d38]'
                                          : 'bg-red-500'
                                      }`}
                                      style={{
                                        width: `${budgetPercent}%`,
                                      }}
                                    />
                                  </div>

                                  <span className="text-[10px] font-medium text-gray-400 shrink-0">
                                    {fitsBudget
                                      ? 'Fits budget'
                                      : 'Over budget'}
                                  </span>
                                </div>

                                {/* Stock */}
                                {!product.inStock && (
                                  <div className="mb-3 text-[10px] font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg px-2 py-1.5">
                                    Currently out of stock
                                  </div>
                                )}

                                {/* Add to shopping list */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    onAddToShoppingList(
                                      product
                                    )
                                  }
                                  disabled={
                                    !product.inStock
                                  }
                                  className="w-full py-2.5 rounded-xl bg-[#135d38] hover:bg-[#0f4d2e] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <ShoppingCart className="w-3.5 h-3.5" />

                                  {product.inStock
                                    ? `Add ${product.store} price`
                                    : 'Out of stock'}
                                </button>
                              </div>
                            );
                          }
                        )}
                      </div>

                      {/* Comparison summary */}
                      {hasMultipleStores && (
                        <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">

                          <p className="text-xs text-gray-500">
                            Cheapest:

                            <span className="font-bold text-[#135d38] ml-1">
                              {
                                cheapestProduct.store
                              }
                            </span>
                          </p>

                          <p className="text-xs text-gray-500">
                            Price difference:

                            <span className="font-bold text-gray-900 ml-1">
                              {formatPrice(
                                priceDifference,
                                currency
                              )}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          )}

          {/* =================================================
              LOAD MORE / AI SEARCH
              ================================================= */}
          <div className="pt-6 text-center">
            <button
              type="button"
              onClick={() =>
                handleSearchSubmit()
              }
              disabled={
                isAiSearching ||
                !query.trim()
              }
              className="px-6 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl shadow-2xs hover:shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAiSearching ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#135d38]" />

                  <span>
                    Searching South African
                    retailers with Gemini AI...
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#135d38]" />

                  <span>
                    Search More with Gemini AI
                  </span>

                  <span className="text-gray-400">
                    →
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};