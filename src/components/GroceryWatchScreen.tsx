import { ProductImage } from './ProductImage';
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Sparkles, MapPin, TrendingDown, RefreshCw, ChevronDown, ChevronUp, Check, ExternalLink, Clock, Tag, ArrowRight, ShieldCheck, Heart, Bell, Loader2 } from 'lucide-react';
import { Currency, Product, BasketComparison } from '../types';
import { formatPrice, NEARBY_STORES } from '../data/mockData';
import { fetchBasketComparison } from '../services/geminiService';

interface GroceryWatchScreenProps {
  currency: Currency;
  onToggleTrack: (p: Product) => void;
  trackedProductIds: Set<string>;
  priceDropProducts: Product[];
}

export const GroceryWatchScreen: React.FC<GroceryWatchScreenProps> = ({
  currency,
  onToggleTrack,
  trackedProductIds,
  priceDropProducts,
}) => {
  const [basketData, setBasketData] = useState<BasketComparison | null>(null);
  const [expandedStore, setExpandedStore] = useState<string | null>('Checkers');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeStorePin, setActiveStorePin] = useState<string>('Checkers Campus Square');

  useEffect(() => {
    loadBasketData();
  }, []);

  const loadBasketData = async () => {
    try {
      setIsRefreshing(true);
      const data = await fetchBasketComparison();
      setBasketData(data);
    } catch (err) {
      console.error('Failed to load basket', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const toggleExpand = (storeName: string) => {
    setExpandedStore(expandedStore === storeName ? null : storeName);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
      {/* Top Header Row (Matching Screenshot 5) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-8 h-8 text-[#135d38]" />
            Grocery Price Watch
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time local price comparisons to stretch your student budget across South Africa.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadBasketData}
            disabled={isRefreshing}
            className="px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl shadow-2xs hover:shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
            title="Refresh prices with live retail scrapers"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#135d38] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Updating...' : 'Refresh Live Prices'}</span>
          </button>
        </div>
      </div>

      {/* Top Price Drops Section (Matching Screenshot 5) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Top Price Drops</h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#135d38] border border-emerald-200/50">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              AI Detected
            </span>
          </div>
          <span className="text-xs text-gray-400 font-medium">Updated 10m ago</span>
        </div>

        {/* 4 Cards Grid (Matching Screenshot 5) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {priceDropProducts.slice(0, 4).map((item) => {
            const isTracked = trackedProductIds.has(item.id);
            return (
              <div
                key={item.id}
                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700 uppercase tracking-wide">
                      {item.store}
                    </span>
                    {item.discountPercent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                        -{item.discountPercent}%
                      </span>
                    )}
                  </div>

                  <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-gray-50 mb-3">
                    <ProductImage
                      product={item}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => onToggleTrack(item)}
                      className={`absolute top-2 right-2 p-1.5 rounded-full transition-all cursor-pointer ${
                        isTracked
                          ? 'bg-red-50 text-red-500 shadow-xs'
                          : 'bg-white/80 backdrop-blur-xs text-gray-400 hover:text-red-500'
                      }`}
                      title="Track price drop"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isTracked ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                  </div>

                  <h3 className="font-bold text-sm text-gray-900 line-clamp-1 mb-1" title={item.title}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 mb-2">{item.unit || item.brand}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-black text-base text-gray-900">
                        {formatPrice(item.priceZar, currency)}
                      </span>
                      {item.originalPriceZar && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(item.originalPriceZar, currency)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleTrack(item)}
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

      {/* 2-Column Section: Student Grocery Basket Table & Nearby Deals / Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Student Grocery Basket Comparison (Matching Screenshot 5) */}
        <div className="lg:col-span-8 bg-white border border-gray-100 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Student Grocery Basket Comparison
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Total cost for 10 common staple items (Bread, Milk, Eggs, Rice, Sugar, Oil, Chicken, Coffee, Potatoes, Noodles) across major South African retailers.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200/80 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Retailer</th>
                  <th className="py-3 px-3">Basket Total</th>
                  <th className="py-3 px-3">vs. Cheapest</th>
                  <th className="py-3 px-3">App Delivery</th>
                  <th className="py-3 px-3">Loyalty Card</th>
                  <th className="py-3 px-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {basketData?.retailers.map((ret, index) => {
                  const isExpanded = expandedStore === ret.name;
                  const isCheapest = ret.differenceZar === 0;

                  return (
                    <React.Fragment key={ret.name}>
                      <tr
                        onClick={() => toggleExpand(ret.name)}
                        className={`hover:bg-gray-50/80 transition-colors cursor-pointer ${
                          isCheapest ? 'bg-emerald-50/40' : ''
                        }`}
                      >
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-md bg-gray-100 text-gray-800 font-black text-xs flex items-center justify-center">
                              {ret.code}
                            </span>
                            <span className="font-bold text-gray-900">{ret.name}</span>
                            {isCheapest && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#135d38]">
                                Best Price
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 font-black text-gray-900 text-sm">
                          {formatPrice(ret.basketTotalZar, currency)}
                        </td>
                        <td className="py-3.5 px-3">
                          {isCheapest ? (
                            <span className="font-bold text-[#135d38]">Cheapest</span>
                          ) : (
                            <span className="text-amber-700 font-semibold">
                              +{formatPrice(ret.differenceZar, currency)}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-gray-600">
                          {formatPrice(ret.deliveryFeeZar, currency)}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                            <Tag className="w-3 h-3 text-gray-400" />
                            {ret.loyaltyProgram}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            type="button"
                            className="p-1 text-gray-400 hover:text-gray-700"
                            aria-label="Toggle details"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Itemized Breakdown Row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="bg-gray-50/70 p-4 border-b border-gray-100">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                                  10-Item Staple Breakdown ({ret.name})
                                </span>
                                <div className="flex items-center gap-2">
                                  {ret.highlights.map((h, i) => (
                                    <span
                                      key={i}
                                      className="text-[10px] bg-white border border-emerald-200 text-[#135d38] px-2 py-0.5 rounded font-medium"
                                    >
                                      ✓ {h}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                                {basketData.staples.map((staple) => (
                                  <div
                                    key={staple}
                                    className="bg-white p-2.5 rounded-xl border border-gray-200/70 text-center shadow-2xs"
                                  >
                                    <p className="text-[10px] text-gray-500 font-medium line-clamp-1" title={staple}>
                                      {staple}
                                    </p>
                                    <p className="font-bold text-xs text-gray-900 mt-1">
                                      {formatPrice(ret.itemPrices[staple] || 25, currency)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Nearby Deals (5km) & Campus Map (Matching Screenshot 5) */}
        <div className="lg:col-span-4 bg-white border border-gray-100 rounded-3xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
              <MapPin className="w-4.5 h-4.5 text-[#135d38]" />
              Nearby Deals (5km)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Specials near campus right now.</p>
          </div>

          {/* Interactive Campus Map Visual Preview */}
          <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-100 border border-gray-200/80 shadow-inner flex items-center justify-center p-3">
            {/* Visual map styled grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-70"></div>
            
            {/* Campus Center Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
              <div className="w-7 h-7 rounded-full bg-[#135d38] text-white flex items-center justify-center shadow-md ring-4 ring-emerald-100">
                <span className="text-[10px] font-bold">U</span>
              </div>
              <span className="text-[9px] font-bold text-[#135d38] bg-white/90 px-1.5 py-0.5 rounded shadow-2xs mt-1">
                Campus Hub
              </span>
            </div>

            {/* Checkers Pin */}
            <button
              onClick={() => setActiveStorePin('Checkers Campus Square')}
              className={`absolute top-6 left-8 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold transition-all shadow-xs cursor-pointer ${
                activeStorePin.includes('Checkers')
                  ? 'bg-emerald-600 text-white scale-110 ring-2 ring-white'
                  : 'bg-white text-gray-700 hover:bg-emerald-50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
              <span>Checkers 1.2km</span>
            </button>

            {/* SPAR Pin */}
            <button
              onClick={() => setActiveStorePin('SPAR Express Student Hub')}
              className={`absolute bottom-6 left-12 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold transition-all shadow-xs cursor-pointer ${
                activeStorePin.includes('SPAR')
                  ? 'bg-emerald-600 text-white scale-110 ring-2 ring-white'
                  : 'bg-white text-gray-700 hover:bg-emerald-50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
              <span>SPAR 0.8km</span>
            </button>

            {/* Pick n Pay Pin */}
            <button
              onClick={() => setActiveStorePin('Pick n Pay Main Rd Plaza')}
              className={`absolute top-8 right-6 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold transition-all shadow-xs cursor-pointer ${
                activeStorePin.includes('Pick n Pay')
                  ? 'bg-emerald-600 text-white scale-110 ring-2 ring-white'
                  : 'bg-white text-gray-700 hover:bg-emerald-50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
              <span>PnP 2.5km</span>
            </button>
          </div>

          {/* Deals List (Matching Screenshot 5) */}
          <div className="space-y-3">
            {[
              {
                title: 'Dr. Oetker Frozen Pizzas (Any 2)',
                store: 'Checkers Campus Square',
                distance: '1.2km',
                priceZar: 89.99,
                tag: 'Ends Today',
                tagColor: 'bg-amber-100 text-amber-900',
              },
              {
                title: 'Nescafé Instant Coffee 200g',
                store: 'Pick n Pay Main Rd',
                distance: '2.5km',
                priceZar: 89.99,
                tag: 'Study Fuel',
                tagColor: 'bg-blue-100 text-blue-900',
              },
              {
                title: 'Instant Noodles 5-Pack',
                store: 'SPAR Express Hub',
                distance: '0.8km',
                priceZar: 28.50,
                tag: 'Low Stock',
                tagColor: 'bg-red-100 text-red-900',
              },
            ].map((deal, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100 hover:bg-emerald-50/40 hover:border-emerald-200 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-xs text-gray-900">{deal.title}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${deal.tagColor}`}>
                      {deal.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {deal.store} ({deal.distance})
                  </p>
                </div>

                <span className="font-black text-sm text-gray-900 shrink-0">
                  {formatPrice(deal.priceZar, currency)}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => alert('Viewing all 14 active student grocery deals within 5km radius of campus.')}
            className="w-full text-center py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#135d38] font-bold text-xs rounded-xl transition-colors cursor-pointer block"
          >
            View All Map Deals →
          </button>
        </div>
      </div>
    </div>
  );
};
