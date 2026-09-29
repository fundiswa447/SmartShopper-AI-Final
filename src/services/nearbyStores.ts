export interface NearbyStore {
  id: string;
  name: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  openingHours?: string;
}

interface ShopElement {
  id: number;
  type: string;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

let nominatimQueue: Promise<void> = Promise.resolve();
let lastNominatimRequest = 0;

export function fetchNominatim(url: string): Promise<Response> {
  const request = nominatimQueue.then(async () => {
    const waitMs = Math.max(0, 1000 - (Date.now() - lastNominatimRequest));
    if (waitMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
    lastNominatimRequest = Date.now();
    return fetch(url, {
      headers: { "User-Agent": "SmartShopper/1.0 (nearby shopping planner)" },
      signal: AbortSignal.timeout(7000),
    });
  });

  nominatimQueue = request.then(() => undefined, () => undefined);
  return request;
}

function getDistanceKm(
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

async function getOsmShops(latitude: number, longitude: number): Promise<ShopElement[]> {
  const radiusMeters = 5000;
  const shopQuery = `[out:json][timeout:8];(node["shop"~"^(supermarket|convenience|grocery|greengrocer|department_store|variety_store|mall)$"](around:${radiusMeters},${latitude},${longitude});way["shop"~"^(supermarket|convenience|grocery|greengrocer|department_store|variety_store|mall)$"](around:${radiusMeters},${latitude},${longitude});relation["shop"~"^(supermarket|convenience|grocery|greengrocer|department_store|variety_store|mall)$"](around:${radiusMeters},${latitude},${longitude});node["amenity"="marketplace"](around:${radiusMeters},${latitude},${longitude});way["amenity"="marketplace"](around:${radiusMeters},${latitude},${longitude}););out center tags;`;

  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "SmartShopper/1.0 (nearby shopping planner)",
      },
      body: new URLSearchParams({ data: shopQuery }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return [];
    const result = await response.json() as { elements?: ShopElement[] };
    return result.elements || [];
  } catch {
    return [];
  }
}

async function getNominatimShops(latitude: number, longitude: number): Promise<ShopElement[]> {
  const latitudeOffset = 0.063;
  const longitudeOffset = latitudeOffset / Math.max(0.2, Math.cos((latitude * Math.PI) / 180));
  const viewbox = [
    longitude - longitudeOffset,
    latitude + latitudeOffset,
    longitude + longitudeOffset,
    latitude - latitudeOffset,
  ].join(",");
  const params = new URLSearchParams({
    format: "jsonv2",
    q: "supermarket",
    viewbox,
    bounded: "1",
    limit: "40",
    extratags: "1",
  });
  const response = await fetchNominatim(`https://nominatim.openstreetmap.org/search?${params}`);
  if (!response.ok) throw new Error("Nearby store search is temporarily unavailable.");

  const places = await response.json() as {
    place_id: number;
    name?: string;
    display_name: string;
    lat: string;
    lon: string;
    type?: string;
    extratags?: { opening_hours?: string };
  }[];

  return places.map((place) => ({
    id: place.place_id,
    type: "node",
    lat: Number(place.lat),
    lon: Number(place.lon),
    tags: {
      name: place.name || place.display_name.split(",")[0],
      shop: place.type || "supermarket",
      "addr:full": place.display_name,
      opening_hours: place.extratags?.opening_hours,
    },
  }));
}

function normalizeStores(elements: ShopElement[], latitude: number, longitude: number): NearbyStore[] {
  return elements
    .map((place) => {
      const storeLatitude = place.lat ?? place.center?.lat;
      const storeLongitude = place.lon ?? place.center?.lon;
      const tags = place.tags || {};
      const name = tags.name || tags.brand;
      if (!name || !Number.isFinite(storeLatitude) || !Number.isFinite(storeLongitude)) {
        return null;
      }

      const address = tags["addr:full"] || [
        [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" "),
        tags["addr:suburb"] || tags["addr:city"],
      ].filter(Boolean).join(", ") || tags.shop || "Address not listed";

      return {
        id: `${place.type}-${place.id}`,
        name,
        category: tags.shop || tags.amenity || "shop",
        address,
        latitude: storeLatitude,
        longitude: storeLongitude,
        distanceKm: getDistanceKm(latitude, longitude, storeLatitude, storeLongitude),
        openingHours: tags.opening_hours?.trim() || undefined,
      };
    })
    .filter((store): store is NonNullable<typeof store> => Boolean(store))
    .filter((store, index, all) => all.findIndex((candidate) =>
      candidate.name === store.name &&
      candidate.latitude === store.latitude &&
      candidate.longitude === store.longitude
    ) === index)
    .sort((first, second) => first.distanceKm - second.distanceKm)
    .slice(0, 80);
}

export async function findNearbyStores(latitude: number, longitude: number): Promise<NearbyStore[]> {
  const osmStores = normalizeStores(await getOsmShops(latitude, longitude), latitude, longitude);
  if (osmStores.length) return osmStores;

  const geocodedShops = await getNominatimShops(latitude, longitude);
  return normalizeStores(geocodedShops, latitude, longitude);
}