import type { IncomingMessage, ServerResponse } from "node:http";
import { findNearbyStores } from "../src/services/nearbyStores";

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Method not allowed." }));
    return;
  }

  const requestUrl = new URL(req.url || "/", "http://localhost");
  const latitude = Number(requestUrl.searchParams.get("lat"));
  const longitude = Number(requestUrl.searchParams.get("lon"));
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    Math.abs(latitude) > 90 ||
    Math.abs(longitude) > 180
  ) {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 400;
    res.end(JSON.stringify({ error: "Valid latitude and longitude are required." }));
    return;
  }

  try {
    const stores = await findNearbyStores(latitude, longitude);
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    res.end(JSON.stringify({ stores }));
  } catch (error) {
    console.error("Nearby store lookup failed:", error);
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 502;
    res.end(JSON.stringify({ error: "Nearby store search is temporarily unavailable." }));
  }
}