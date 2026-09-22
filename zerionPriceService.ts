// src/services/zerionPriceService.ts

import type {
  PriceCurrency,
  StablecoinPrice,
  StablecoinPriceChart,
  StablecoinSymbol,
  ZerionChartPeriod,
} from "../schemas/SchemaPriceTracking";

const ZERION_API = "https://api.zerion.io/v1";

const STABLECOINS: StablecoinSymbol[] = [
  "CADC",
  "USDC",
  "EURC",
  "GBP",
];

function getAuthHeader(): string {
  const apiKey = process.env.ZERION_API_KEY;

  if (!apiKey) {
    throw new Error("Missing ZERION_API_KEY");
  }

  return `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`;
}

async function zerionFetch<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: getAuthHeader(),
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const body = await response.text();

    throw new Error(
      `Zerion API ${response.status}: ${body}`
    );
  }

  return response.json() as Promise<T>;
}

interface ZerionFungible {
  type: "fungibles";
  id: string;

  attributes: {
    symbol: string;
    name: string;

    market_data?: {
      price?: number;
    };
  };
}

interface ZerionFungibleResponse {
  data: ZerionFungible[];
}

interface ZerionChartResponse {
  data: {
    type: "fungible_charts";
    id: string;

    attributes: {
      stats?: {
        first?: number;
        min?: number;
        avg?: number;
        max?: number;
        last?: number;
      };

      points: [number, number][];
    };
  };
}

/**
 * Resolve a token symbol to its Zerion fungible ID.
 *
 * Important:
 * CADC/USDC/EURC/GBP are symbols.
 * Zerion requires the actual fungible ID for chart requests.
 */
export async function resolveStablecoin(
  symbol: StablecoinSymbol
): Promise<ZerionFungible> {
  const url =
    `${ZERION_API}/fungibles/` +
    `?filter[search_query]=${encodeURIComponent(symbol)}`;

  const response =
    await zerionFetch<ZerionFungibleResponse>(url);

  const match = response.data.find(
    (asset) =>
      asset.attributes.symbol.toUpperCase() === symbol
  );

  if (!match) {
    throw new Error(
      `Zerion fungible not found for ${symbol}`
    );
  }

  return match;
}

/**
 * Get current stablecoin prices.
 */
export async function getStablecoinPrices(
  currency: PriceCurrency = "usd"
): Promise<StablecoinPrice[]> {
  const results: StablecoinPrice[] = [];

  for (const symbol of STABLECOINS) {
    const asset = await resolveStablecoin(symbol);

    const price =
      asset.attributes.market_data?.price;

    if (price === undefined) {
      continue;
    }

    results.push({
      symbol,
      fungibleId: asset.id,
      currency,
      price,
      timestamp: Date.now(),
      source: "zerion",
    });
  }

  return results;
}

/**
 * Get historical price chart for one stablecoin.
 */
export async function getStablecoinChart(
  symbol: StablecoinSymbol,
  period: ZerionChartPeriod = "day",
  currency: PriceCurrency = "usd"
): Promise<StablecoinPriceChart> {
  const asset = await resolveStablecoin(symbol);

  const url =
    `${ZERION_API}/fungibles/` +
    `${asset.id}/charts/${period}` +
    `?currency=${currency}`;

  const response =
    await zerionFetch<ZerionChartResponse>(url);

  const attributes = response.data.attributes;

  return {
    symbol,
    fungibleId: asset.id,
    currency,
    period,

    points: attributes.points.map(
      ([timestamp, price]) => ({
        timestamp,
        price,
      })
    ),

    stats: attributes.stats,

    source: "zerion",

    fetchedAt: Date.now(),
  };
}
// app/api/prices/stablecoins/route.ts

import {
  getStablecoinPrices,
} from "@/services/zerionPriceService";

import type {
  PriceCurrency,
} from "@/schemas/SchemaPriceTracking";

export async function GET(request: Request) {
  try {
    const { searchParams } =
      new URL(request.url);

    const currency =
      (searchParams.get("currency") || "usd")
        .toLowerCase() as PriceCurrency;

    const prices =
      await getStablecoinPrices(currency);

    return Response.json({
      provider: "zerion",
      currency,
      prices,
      fetchedAt: Date.now(),
    });
  } catch (error) {
    console.error("Stablecoin price error:", error);

    return Response.json(
      {
        error: "Unable to fetch stablecoin prices",
      },
      {
        status: 500,
      }
    );
  }
}