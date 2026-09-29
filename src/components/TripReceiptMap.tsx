import { useEffect, useRef } from 'react';
import L from 'leaflet';

interface TripMapStore {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
}

interface TripReceiptMapProps {
  userLocation: [number, number] | null;
  stores: TripMapStore[];
  storesToVisit: string[];
  selectedStoreId: string;
  onSelectStore: (storeId: string) => void;
}

export function TripReceiptMap({ userLocation, stores, storesToVisit, selectedStoreId, onSelectStore }: TripReceiptMapProps) {
  const mapElement = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapElement.current || !userLocation) return;
    if (!map.current) {
      map.current = L.map(mapElement.current, { scrollWheelZoom: false });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map.current);
    }

    const mapInstance = map.current;
    mapInstance.setView(userLocation, 14);
    markers.current?.remove();
    markers.current = L.layerGroup().addTo(mapInstance);
    L.marker(userLocation, {
      icon: L.divIcon({ className: 'smartshopper-user-marker', html: '<span></span>', iconSize: [22, 22], iconAnchor: [11, 11] }),
    }).bindPopup('Your location').addTo(markers.current);

    stores.forEach((store) => {
      const isRequired = storesToVisit.includes(store.id);
      const isSelected = store.id === selectedStoreId;
      const className = `smartshopper-trip-store-marker${isRequired ? ' required' : ''}${isSelected ? ' selected' : ''}`;
      const marker = L.marker([store.latitude, store.longitude], {
        icon: L.divIcon({ className, html: '<span></span>', iconSize: [22, 22], iconAnchor: [11, 11] }),
      });
      const popup = document.createElement('div');
      const name = document.createElement('strong');
      name.textContent = store.name;
      popup.append(name);
      const distance = document.createElement('div');
      distance.textContent = `${store.distanceKm.toFixed(1)} km from your location`;
      popup.append(distance);
      if (isRequired) {
        const requiredLabel = document.createElement('div');
        requiredLabel.textContent = 'On your shopping list';
        popup.append(requiredLabel);
      }
      marker.bindPopup(popup).on('click', () => onSelectStore(store.id)).addTo(markers.current!);
    });

    const destinations = stores.filter((store) => storesToVisit.includes(store.id) || store.id === selectedStoreId);
    const bounds = L.latLngBounds([userLocation, ...destinations.map((store) => [store.latitude, store.longitude] as [number, number])]);
    mapInstance.fitBounds(bounds, { padding: [28, 28], maxZoom: 14 });
    const resizeId = window.setTimeout(() => mapInstance.invalidateSize(), 0);
    return () => window.clearTimeout(resizeId);
  }, [userLocation, stores, storesToVisit, selectedStoreId, onSelectStore]);

  useEffect(() => () => {
    markers.current?.remove();
    map.current?.remove();
    markers.current = null;
    map.current = null;
  }, []);

  return userLocation ? (
    <div ref={mapElement} className="h-[300px] bg-gray-100 sm:h-[380px]" aria-label="Live map showing nearby shops and required shopping stops" />
  ) : (
    <div className="flex h-[300px] items-center justify-center bg-gray-100 px-6 text-center text-sm text-gray-600 sm:h-[380px]">
      Add a location in Profile to show the map and nearby shopping stops.
    </div>
  );
}