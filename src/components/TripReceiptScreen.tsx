import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Footprints,
  LocateFixed,
  MapPin,
  Navigation,
  ReceiptText,
  RefreshCw,
  Search,
  Store,
  Trash2,
} from 'lucide-react';
import type { Currency, UserProfile } from '../types';
import { formatPrice } from '../data/mockData';
import { TripReceiptMap } from './TripReceiptMap';

interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  priceZar: number;
  store?: string;
  completed: boolean;
}

interface NearbyStore {
  id: string;
  name: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  openingHours?: string;
}

interface TripReceiptScreenProps {
  profile: UserProfile;
  items: ShoppingListItem[];
  currency: Currency;
  totalBudgetZar: number;
  spentBudgetZar: number;
  onBack: () => void;
  onCompletePurchase: (items: ShoppingListItem[]) => void;
}

const money = (amount: number, currency: Currency) =>
  formatPrice(amount, currency);

const formatDistance = (distanceKm: number) =>
  distanceKm < 1
    ? `${Math.round(distanceKm * 1000)} m`
    : `${distanceKm.toFixed(1)} km`;

function normalizeStoreName(name: string): string {
  return name
    .toLowerCase()
    .replace(/pick\s*n\s*pay|p\s*&\s*np/g, 'pnp')
    .replace(/[^a-z0-9]/g, '')
    .replace(/food|hyper|supermarket|express/g, '');
}

function areStoresEquivalent(first: string, second: string): boolean {
  const normalizedFirst = normalizeStoreName(first);
  const normalizedSecond = normalizeStoreName(second);
  return normalizedFirst === normalizedSecond ||
    normalizedFirst.includes(normalizedSecond) ||
    normalizedSecond.includes(normalizedFirst);
}

export function TripReceiptScreen({
  profile,
  items,
  currency,
  totalBudgetZar,
  spentBudgetZar,
  onBack,
  onCompletePurchase,
}: TripReceiptScreenProps) {
  const [nearbyStores, setNearbyStores] = useState<NearbyStore[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    profile.latitude !== undefined && profile.longitude !== undefined
      ? [profile.latitude, profile.longitude]
      : null
  );
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [locationInput, setLocationInput] = useState(profile.location || '');
  const [tripLocationLabel, setTripLocationLabel] = useState(profile.location || '');
  const [receiptItems, setReceiptItems] = useState(() => items.map((item) => ({ ...item, completed: true })));
  const [isLoadingStores, setIsLoadingStores] = useState(false);
  const [isResolvingLocation, setIsResolvingLocation] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');
  const [refreshVersion, setRefreshVersion] = useState(0);
  const loadedLocationKey = useRef('');
  const handleSelectStore = useCallback((storeId: string) => {
    setSelectedStoreId(storeId);
  }, []);

  useEffect(() => setReceiptItems(items.map((item) => ({ ...item, completed: true }))), [items]);

  const basketTotal = receiptItems
    .filter((item) => item.completed)
    .reduce(
    (total, item) => total + item.priceZar * item.quantity,
    0
  );

  const storeBreakdown = useMemo(() => {
    const totals = new Map<string, { amount: number; count: number }>();
    receiptItems.filter((item) => item.completed).forEach((item) => {
      const store = item.store || 'Store not selected';
      const existing = totals.get(store) || { amount: 0, count: 0 };
      totals.set(store, {
        amount: existing.amount + item.priceZar * item.quantity,
        count: existing.count + item.quantity,
      });
    });

    return Array.from(totals.entries())
      .map(([store, total]) => ({ store, ...total }))
      .sort((a, b) => a.amount - b.amount);
  }, [receiptItems]);

  useEffect(() => {
    let active = true;
    const originLatitude = userLocation?.[0] ?? profile.latitude;
    const originLongitude = userLocation?.[1] ?? profile.longitude;
    const initialLocationKey = originLatitude !== undefined && originLongitude !== undefined
      ? `${originLatitude},${originLongitude}:${refreshVersion}`
      : `${profile.location || ''}:${refreshVersion}`;

    if (loadedLocationKey.current === initialLocationKey) {
      return;
    }
    loadedLocationKey.current = initialLocationKey;

    const loadNearbyStores = async () => {
      setIsLoadingStores(true);
      setLocationMessage('Finding shops near your location…');

      try {
        let latitude = userLocation?.[0] ?? profile.latitude;
        let longitude = userLocation?.[1] ?? profile.longitude;
        let displayName = tripLocationLabel || profile.location || '';

        if ((latitude === undefined || longitude === undefined) && profile.location?.trim()) {
          const geocodeResponse = await fetch(
            `/api/location/geocode?q=${encodeURIComponent(profile.location.trim())}`
          );
          if (!geocodeResponse.ok) {
            throw new Error('Could not find that saved location.');
          }
          const geocode = (await geocodeResponse.json()) as {
            latitude: number;
            longitude: number;
            displayName: string;
          };
          latitude = geocode.latitude;
          longitude = geocode.longitude;
          setUserLocation([latitude, longitude]);
          displayName = geocode.displayName;
          setTripLocationLabel(displayName);
          loadedLocationKey.current = `${latitude},${longitude}:${refreshVersion}`;
        }

        if (latitude === undefined || longitude === undefined) {
          setLocationMessage('Use live location or add an address to see nearby shops.');
          setNearbyStores([]);
          return;
        }

        const response = await fetch(
          `/api/nearby-stores?lat=${latitude}&lon=${longitude}`
        );
        if (!response.ok) {
          throw new Error('Nearby shops could not be loaded right now.');
        }

        const result = (await response.json()) as { stores: NearbyStore[] };
        if (!active) return;

        setNearbyStores(result.stores);
        setLocationMessage(
          result.stores.length
            ? `Nearby shops around ${displayName || profile.location || 'your saved location'}`
            : 'No nearby shops were found within 7 km.'
        );
        setSelectedStoreId((current) =>
          result.stores.some((store) => store.id === current)
            ? current
            : result.stores.find((store) =>
                storeBreakdown.some((entry) => areStoresEquivalent(entry.store, store.name))
              )?.id || result.stores[0]?.id || ''
        );
      } catch (error) {
        if (active) {
          setLocationMessage(
            error instanceof Error
              ? error.message
              : 'Nearby shops could not be loaded right now.'
          );
        }
      } finally {
        if (active) setIsLoadingStores(false);
      }
    };

    void loadNearbyStores();
    return () => {
      active = false;
    };
  }, [profile.latitude, profile.longitude, profile.location, refreshVersion, storeBreakdown, userLocation, tripLocationLabel]);

  const selectedStore = nearbyStores.find(
    (store) => store.id === selectedStoreId
  );
  const storesToVisit = nearbyStores
    .filter((store) => storeBreakdown.some((entry) => areStoresEquivalent(entry.store, store.name)))
    .map((store) => store.id);
  const walkRecommendation = selectedStore && selectedStore.distanceKm <= 2
    ? `${selectedStore.name} is ${formatDistance(selectedStore.distanceKm)} away in a straight line. This looks walkable; walking distance may be longer depending on available roads and crossings.`
    : selectedStore && selectedStore.distanceKm > 2
      ? `${selectedStore.name} is ${formatDistance(selectedStore.distanceKm)} away in a straight line. Consider a taxi because the shop is farther away; the actual road distance may be longer.`
      : 'Select a nearby shop to get a distance-based travel suggestion.';

  const storeComparisons = storeBreakdown.map((entry) => {
    const nearby = nearbyStores.find((store) =>
      areStoresEquivalent(entry.store, store.name)
    );

    return { ...entry, nearby };
  });

  const handleAddLocation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const address = locationInput.trim();
    if (!address) return;
    setIsResolvingLocation(true);
    setLocationMessage('Finding nearby shops for this address…');
    try {
      const response = await fetch(`/api/location/geocode?q=${encodeURIComponent(address)}`);
      if (!response.ok) throw new Error('Could not find that address. Try a nearby street, suburb, or campus.');
      const result = await response.json() as { latitude: number; longitude: number; displayName: string };
      setUserLocation([result.latitude, result.longitude]);
      setLocationInput(result.displayName);
      setTripLocationLabel(result.displayName);
      setRefreshVersion((version) => version + 1);
    } catch (error) {
      setLocationMessage(error instanceof Error ? error.message : 'Location lookup failed.');
    } finally {
      setIsResolvingLocation(false);
    }
  };

  const handleUseLiveLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Live location is not available in this browser. Add an address instead.');
      return;
    }
    setIsResolvingLocation(true);
    setLocationMessage('Getting your live location…');
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const latitude = coords.latitude;
      const longitude = coords.longitude;
      let displayName = 'Current location';
      try {
        const response = await fetch(`/api/location/geocode?lat=${latitude}&lon=${longitude}`);
        if (response.ok) {
          const result = await response.json() as { displayName: string };
          displayName = result.displayName;
        }
      } catch {
        // Coordinates still work when reverse geocoding is unavailable.
      }
      setUserLocation([latitude, longitude]);
      setLocationInput(displayName);
      setTripLocationLabel(displayName);
      setRefreshVersion((version) => version + 1);
      setIsResolvingLocation(false);
    }, () => {
      setLocationMessage('Location permission was not granted. Add an address to find nearby shops.');
      setIsResolvingLocation(false);
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-10">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to shopping list
      </button>

      <section className="overflow-hidden rounded-3xl bg-[#103d2a] text-white shadow-lg">
        <div className="grid gap-6 p-6 sm:p-9 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs text-emerald-100">
              <ReceiptText className="h-3.5 w-3.5" /> TRIP ESTIMATE
            </span>
            <h1 className="mt-4 text-3xl font-black">Your shopping trip</h1>
            <p className="mt-2 text-sm text-emerald-100">Nearby shops, map distances, and a basket ready to save.</p>
          </div>
          <div className="min-w-52 border-l border-white/20 pl-5">
            <p className="text-xs uppercase text-emerald-100">Selected basket total</p>
            <p className="mt-1 text-3xl font-bold">{money(basketTotal, currency)}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-px bg-white/15 sm:grid-cols-3">
          <div className="bg-[#103d2a] p-4 sm:px-6">
            <p className="text-xs text-emerald-100">Shopping</p>
            <p className="mt-1 font-bold">{money(basketTotal, currency)}</p>
          </div>
          <div className="bg-[#103d2a] p-4 sm:px-6">
            <p className="text-xs text-emerald-100">Budget before trip</p>
            <p className="mt-1 font-bold">{money(totalBudgetZar - spentBudgetZar, currency)}</p>
          </div>
          <div className="bg-[#103d2a] p-4 sm:px-6">
            <p className="text-xs text-emerald-100">Budget after basket</p>
            <p className={`mt-1 font-bold ${totalBudgetZar - spentBudgetZar - basketTotal < 0 ? 'text-rose-200' : 'text-white'}`}>
              {money(totalBudgetZar - spentBudgetZar - basketTotal, currency)}
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="flex flex-col gap-2 border-b border-gray-100 p-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900"><MapPin className="h-5 w-5 text-emerald-700" /> Live nearby-shop map</h2>
            <p className="mt-1 text-xs text-gray-500">Green markers match shops on your basket. Enter a trip location or use live location to find nearby stores.</p>
          </div>
          <div className="flex flex-wrap gap-3 text-[11px] font-semibold text-gray-600">
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-600" /> Your location</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-700" /> Basket stop</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-gray-500" /> Nearby shop</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-600" /> Selected destination</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row">
          <button
            type="button"
            onClick={handleUseLiveLocation}
            disabled={isResolvingLocation}
            className="inline-flex shrink-0 items-center justify-center gap-2 border border-emerald-800 px-4 py-2.5 text-xs font-bold text-emerald-900 hover:bg-emerald-50 disabled:opacity-50"
          >
            <LocateFixed className="h-4 w-4" /> Use live location
          </button>
          <form onSubmit={handleAddLocation} className="flex min-w-0 flex-1 gap-2">
            <label className="sr-only" htmlFor="receipt-trip-location">Trip location</label>
            <input
              id="receipt-trip-location"
              type="text"
              value={locationInput}
              onChange={(event) => setLocationInput(event.target.value)}
              placeholder="Enter an address, campus, or someone else's location"
              className="min-w-0 flex-1 border border-gray-300 px-3 py-2.5 text-xs text-gray-900 outline-none focus:border-emerald-700"
            />
            <button
              type="submit"
              disabled={isResolvingLocation || !locationInput.trim()}
              className="inline-flex shrink-0 items-center gap-2 bg-emerald-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-900 disabled:opacity-50"
            >
              <Search className="h-4 w-4" /> Add location
            </button>
          </form>
        </div>
        <TripReceiptMap
          userLocation={userLocation}
          stores={nearbyStores}
          storesToVisit={storesToVisit}
          selectedStoreId={selectedStoreId}
          onSelectStore={handleSelectStore}
        />
        {storeBreakdown.length > 0 && nearbyStores.length > 0 && storesToVisit.length === 0 && (
          <p className="border-t border-amber-100 bg-amber-50 px-5 py-2 text-xs text-amber-900">No nearby map listing matches the store names in this basket. Nearby shops are still shown; choose the shop you plan to visit below.</p>
        )}
        <p className="border-t border-gray-100 px-5 py-2 text-[10px] text-gray-400">Map tiles and shop locations from OpenStreetMap. Pins identify stores; road routes are not shown.</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 border-b border-dashed border-gray-300 pb-4">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <MapPin className="h-5 w-5 text-emerald-700" /> Nearby shops
              </h2>
              <p className="mt-1 text-xs text-gray-500">{locationMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setRefreshVersion((version) => version + 1)}
              disabled={isLoadingStores}
              className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              title="Refresh nearby shops"
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingStores ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {nearbyStores.length ? (
            <div className="mt-3 divide-y divide-dashed divide-gray-200">
              {nearbyStores.slice(0, 8).map((store) => (
                <button
                  type="button"
                  key={store.id}
                  onClick={() => handleSelectStore(store.id)}
                  className={`flex w-full items-center justify-between gap-4 py-3 text-left ${selectedStoreId === store.id ? 'text-emerald-900' : 'text-gray-800'}`}
                >
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 font-semibold">
                      <Store className="h-4 w-4 shrink-0 text-emerald-700" />
                      <span className="truncate">{store.name}</span>
                      {selectedStoreId === store.id && <Check className="h-4 w-4 shrink-0" />}
                    </span>
                    <span className="mt-1 block truncate pl-6 text-xs text-gray-500">
                      {store.address || store.category}
                    </span>
                    <span className="mt-1 block pl-6 text-[11px] text-gray-600">
                      Opening hours (local time): {store.openingHours || 'Not listed on OpenStreetMap'}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-bold">{formatDistance(store.distanceKm)}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-sm text-gray-500">
              <MapPin className="mx-auto mb-2 h-7 w-7 text-gray-300" />
              {isLoadingStores ? 'Searching nearby…' : 'Use live location or add an address above to find nearby shops.'}
            </div>
          )}
          {selectedStore && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedStore.latitude},${selectedStore.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 hover:underline"
            >
              <Navigation className="h-3.5 w-3.5" /> Directions to {selectedStore.name}
            </a>
          )}
          <p className="mt-4 border-t border-dashed border-gray-200 pt-3 text-[10px] leading-relaxed text-gray-400">
            Shops and straight-line distances from OpenStreetMap. Road routes may be longer.
          </p>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <Footprints className="h-5 w-5 text-emerald-700" /> Travel suggestion
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            {selectedStore ? `Based on the map distance to ${selectedStore.name}` : 'Choose a nearby shop first'}
          </p>
          <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">
            {walkRecommendation}
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-gray-500">No transport is selected or priced here. Distances are straight-line estimates from the nearby-shop map.</p>
        </section>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
        <div className="flex flex-col gap-2 border-b border-dashed border-gray-300 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Basket receipt</h2>
            <p className="mt-1 text-xs text-gray-500">Your saved item prices, grouped by the stores selected on your list.</p>
          </div>
          <span className="font-mono text-xs text-gray-500">{receiptItems.length} items remaining</span>
        </div>
        <div className="divide-y divide-dashed divide-gray-200">
          {receiptItems.map((item) => (
            <div key={item.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 py-3 text-xs">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={(event) => setReceiptItems((previous) => previous.map((entry) => entry.id === item.id
                  ? { ...entry, completed: event.target.checked }
                  : entry
                ))}
                aria-label={`Include ${item.name} in this purchase`}
                className="h-4 w-4 accent-emerald-700"
              />
              <span className={`truncate ${item.completed ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>{item.quantity} × {item.name}</span>
              <span className="text-gray-500 sm:text-right">{item.store || 'Store TBD'}</span>
              <span className="text-right font-bold text-gray-900">{money(item.priceZar * item.quantity, currency)}</span>
              <button type="button" onClick={() => setReceiptItems((previous) => previous.filter((entry) => entry.id !== item.id))} aria-label={`Remove ${item.name}`} title="Remove item" className="text-gray-400 hover:text-rose-700"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
        <div className="mt-2 border-t-2 border-dashed border-gray-300 pt-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Store basket comparison</p>
          {storeComparisons.map((entry) => (
            <button
              type="button"
              key={entry.store}
              onClick={() => entry.nearby && handleSelectStore(entry.nearby.id)}
              disabled={!entry.nearby}
              className={`flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left text-xs ${entry.nearby?.id === selectedStoreId ? 'bg-emerald-50' : 'hover:bg-gray-50'} disabled:cursor-default disabled:opacity-70`}
            >
              <span className="min-w-0">
                <span className="block truncate font-semibold text-gray-800">{entry.store} · {entry.count} items</span>
                <span className="block text-[10px] text-gray-500">
                  {entry.nearby ? `${formatDistance(entry.nearby.distanceKm)} from your location` : 'No matching location found nearby'}
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block font-bold text-gray-900">{money(entry.amount, currency)}</span>
              </span>
            </button>
          ))}
          <div className="mt-2 flex justify-between border-t border-gray-200 pt-3 text-sm font-black">
            <span>Shopping subtotal</span>
            <span>{money(basketTotal, currency)}</span>
          </div>
          <div className="mt-3 flex justify-between text-sm font-bold">
            <span>Budget left after basket</span>
            <span className={totalBudgetZar - spentBudgetZar - basketTotal < 0 ? 'text-rose-700' : 'text-emerald-800'}>
              {money(totalBudgetZar - spentBudgetZar - basketTotal, currency)}
            </span>
          </div>
          <button
            type="button"
            disabled={!receiptItems.some((item) => item.completed)}
            onClick={() => onCompletePurchase(receiptItems.filter((item) => item.completed))}
            className="mt-5 w-full rounded-xl bg-emerald-800 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save receipt and record purchase
          </button>
        </div>
      </section>
    </div>
  );
}
