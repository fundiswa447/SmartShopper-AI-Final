import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocateFixed, MapPin, RefreshCw, Store } from 'lucide-react';
import type { UserProfile } from '../types';

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

interface NearbyStoresMapProps {
  profile: UserProfile;
  onLocationResolved: (location: Partial<UserProfile>) => void;
  autoLocate?: boolean;
}

type MapStyle = 'street' | 'satellite';

const tileUrls: Record<MapStyle, string> = {
  street: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
};

const nearbyStoresCacheTtlMs = 7 * 24 * 60 * 60 * 1000;

function getNearbyStoresCacheKey(location: [number, number]): string {
  return `smartshopper_nearby_stores_${location[0].toFixed(2)}_${location[1].toFixed(2)}`;
}

function distanceBetweenKm(
  latitudeA: number,
  longitudeA: number,
  latitudeB: number,
  longitudeB: number
): number {
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const latitudeDelta = radians(latitudeB - latitudeA);
  const longitudeDelta = radians(longitudeB - longitudeA);
  const arc =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(radians(latitudeA)) *
      Math.cos(radians(latitudeB)) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(arc), Math.sqrt(1 - arc));
}

function readCachedNearbyStores(location: [number, number]): NearbyStore[] {
  try {
    const cached = JSON.parse(localStorage.getItem(getNearbyStoresCacheKey(location)) || 'null') as {
      savedAt?: number;
      stores?: NearbyStore[];
    } | null;
    if (
      !cached ||
      !Number.isFinite(cached.savedAt) ||
      Date.now() - Number(cached.savedAt) > nearbyStoresCacheTtlMs ||
      !Array.isArray(cached.stores)
    ) return [];

    return cached.stores
      .filter((store) =>
        Boolean(store) &&
        typeof store.id === 'string' &&
        typeof store.name === 'string' &&
        Number.isFinite(store.latitude) &&
        Number.isFinite(store.longitude)
      )
      .map((store) => ({
        ...store,
        distanceKm: distanceBetweenKm(location[0], location[1], store.latitude, store.longitude),
      }));
  } catch {
    return [];
  }
}

export function NearbyStoresMap({ profile, onLocationResolved, autoLocate = false }: NearbyStoresMapProps) {
  const mapElement = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const tileLayer = useRef<L.TileLayer | null>(null);
  const [stores, setStores] = useState<NearbyStore[]>([]);
  const [location, setLocation] = useState<[number, number] | null>(
    profile.latitude !== undefined && profile.longitude !== undefined
      ? [profile.latitude, profile.longitude]
      : null
  );
  const [mapStyle, setMapStyle] = useState<MapStyle>('street');
  const [message, setMessage] = useState('Add your shopping location in Profile to find nearby stores.');
  const [loading, setLoading] = useState(false);
  const [locationSource, setLocationSource] = useState<'live' | 'saved'>('saved');
  const autoLocateRequested = useRef(false);
  const liveLocationApplied = useRef(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (profile.latitude !== undefined && profile.longitude !== undefined) {
        setLocation([profile.latitude, profile.longitude]);
      } else if (profile.location?.trim()) {
        setLoading(true);
        setMessage('Finding your location and nearby shops...');
        try {
          const response = await fetch(`/api/location/geocode?q=${encodeURIComponent(profile.location.trim())}`);
          if (!response.ok) throw new Error('Could not resolve that location. Check the address in Profile.');
          const result = await response.json() as { latitude: number; longitude: number; displayName: string };
          if (!active || liveLocationApplied.current) return;
          setLocation([result.latitude, result.longitude]);
          setLocationSource('saved');
          onLocationResolved({ latitude: result.latitude, longitude: result.longitude, location: result.displayName });
        } catch (error) {
          if (active) setMessage(error instanceof Error ? error.message : 'Location lookup failed.');
        } finally {
          if (active) setLoading(false);
        }
      }
    };
    void load();
    return () => { active = false; };
  }, [profile.latitude, profile.longitude, profile.location]);

  useEffect(() => {
    let active = true;
    const loadStores = async () => {
      if (!location) {
        setStores([]);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`/api/nearby-stores?lat=${location[0]}&lon=${location[1]}`);
        if (!response.ok) throw new Error('Nearby stores are temporarily unavailable.');
        const result = await response.json() as { stores: NearbyStore[] };
        if (!active) return;
        if (Array.isArray(result.stores) && result.stores.length) {
          setStores(result.stores);
          try {
            localStorage.setItem(getNearbyStoresCacheKey(location), JSON.stringify({
              savedAt: Date.now(),
              stores: result.stores,
            }));
          } catch {
            // Keep live results available when browser storage is disabled or full.
          }
          setMessage(locationSource === 'live'
            ? 'Nearby stores around your live location.'
            : `Nearby stores around ${profile.location || 'your saved location'}`);
        } else {
          const cachedStores = readCachedNearbyStores(location);
          setStores(cachedStores);
          setMessage(cachedStores.length
            ? 'Showing recently saved nearby shops while live results are unavailable.'
            : 'Live shop data is unavailable. Search nearby shops on Google Maps.');
        }
      } catch (error) {
        if (active) {
          const cachedStores = readCachedNearbyStores(location);
          setStores(cachedStores);
          setMessage(cachedStores.length
            ? 'Showing recently saved nearby shops while live results are unavailable.'
            : error instanceof Error ? error.message : 'Nearby stores could not be loaded.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadStores();
    return () => { active = false; };
  }, [location, profile.location, locationSource]);

  useEffect(() => {
    if (!mapElement.current || !location) return;
    if (!map.current) {
      map.current = L.map(mapElement.current, { scrollWheelZoom: false }).setView(location, 14);
      tileLayer.current = L.tileLayer(tileUrls[mapStyle], {
        maxZoom: 19,
        attribution: mapStyle === 'street'
          ? '&copy; OpenStreetMap contributors'
          : 'Tiles &copy; Esri',
      }).addTo(map.current);
    } else {
      map.current.setView(location, 14);
    }

    const markers = L.layerGroup().addTo(map.current);
    const userIcon = L.divIcon({
      className: 'smartshopper-user-marker',
      html: '<span></span>',
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });
    L.marker(location, { icon: userIcon })
      .bindPopup(locationSource === 'live' ? 'Your live location' : 'Your saved shopping location')
      .addTo(markers);
    stores.forEach((store) => {
      const storeIcon = L.divIcon({
        className: 'smartshopper-store-marker',
        html: '<span></span>',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      L.marker([store.latitude, store.longitude], { icon: storeIcon })
        .bindPopup(`<strong>${store.name}</strong><br>${(store.distanceKm).toFixed(1)} km away`)
        .addTo(markers);
    });
    return () => { markers.remove(); };
  }, [location, stores, locationSource]);

  useEffect(() => {
    if (!map.current || !tileLayer.current) return;
    tileLayer.current.remove();
    tileLayer.current = L.tileLayer(tileUrls[mapStyle], {
      maxZoom: 19,
      attribution: mapStyle === 'street'
        ? '&copy; OpenStreetMap contributors'
        : 'Tiles &copy; Esri',
    }).addTo(map.current);
  }, [mapStyle]);

  useEffect(() => () => {
    map.current?.remove();
    map.current = null;
    tileLayer.current = null;
  }, []);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMessage('Location services are not available in this browser.');
      return;
    }
    setLoading(true);
    setMessage('Requesting your live location…');
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const nextLocation: [number, number] = [coords.latitude, coords.longitude];
      liveLocationApplied.current = true;
      setLocation(nextLocation);
      setLocationSource('live');
      setMessage('Showing shops near your live location.');
      setLoading(false);
    }, () => {
      setLoading(false);
      setMessage('Location permission was not granted. Add an address in Profile or try again.');
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 });
  };

  useEffect(() => {
    if (!autoLocate || autoLocateRequested.current) return;
    autoLocateRequested.current = true;
    useCurrentLocation();
  }, [autoLocate]);

  return (
    <section className="overflow-hidden border border-gray-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-base font-bold text-gray-900"><MapPin className="h-4 w-4 text-emerald-700" /> Stores near you</h2>
          <p className="mt-1 text-xs text-gray-500">{message}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex border border-gray-200" role="group" aria-label="Map style">
            <button type="button" onClick={() => setMapStyle('street')} className={`px-3 py-2 text-xs font-semibold ${mapStyle === 'street' ? 'bg-gray-900 text-white' : 'text-gray-600'}`}>Street</button>
            <button type="button" onClick={() => setMapStyle('satellite')} className={`border-l border-gray-200 px-3 py-2 text-xs font-semibold ${mapStyle === 'satellite' ? 'bg-gray-900 text-white' : 'text-gray-600'}`}>Satellite</button>
          </div>
          <button type="button" onClick={useCurrentLocation} disabled={loading} title="Use current location" className="inline-flex h-9 w-9 items-center justify-center border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"><LocateFixed className="h-4 w-4" /></button>
          <button type="button" onClick={() => location && setLocation([...location])} disabled={loading || !location} title="Refresh nearby stores" className="inline-flex h-9 w-9 items-center justify-center border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></button>
        </div>
      </div>
      <div className="grid lg:grid-cols-[minmax(0,1.6fr)_minmax(260px,0.8fr)]">
        <div ref={mapElement} className="h-[300px] bg-gray-100 sm:h-[380px]" aria-label="Map of nearby shops" />
        <div className="max-h-[380px] divide-y divide-gray-100 overflow-y-auto">
          {stores.length ? stores.slice(0, 12).map((store) => (
            <a key={store.id} href={`https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`} target="_blank" rel="noreferrer" className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50">
              <Store className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-gray-900">{store.name}</span>
                <span className="mt-0.5 block truncate text-[11px] text-gray-500">{store.address}</span>
                <span className="mt-1 block text-[11px] text-gray-600">Opening hours (local time): {store.openingHours || 'Not listed on OpenStreetMap'}</span>
              </span>
              <span className="shrink-0 text-xs font-bold text-gray-700">{store.distanceKm.toFixed(1)} km</span>
            </a>
          )) : (
            <div className="flex h-full min-h-40 flex-col items-center justify-center p-6 text-center text-sm text-gray-500">
              <MapPin className="mb-2 h-6 w-6 text-gray-300" />
              {loading ? 'Finding nearby stores...' : location ? (
                <>
                  <span>{message}</span>
                  <a
                    href={`https://www.google.com/maps/search/shops/@${location[0]},${location[1]},14z`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 font-semibold text-emerald-700 underline"
                  >
                    Open nearby shops in Google Maps
                  </a>
                </>
              ) : 'Add a location in Profile to show nearby stores.'}
            </div>
          )}
        </div>
      </div>
      <p className="border-t border-gray-100 px-4 py-2 text-[10px] text-gray-400">Store locations use OpenStreetMap data. Satellite imagery by Esri. Live traffic tiles are not configured.</p>
    </section>
  );
}
