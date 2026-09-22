// src/schemas/SchemaPriceTracking.ts

export const STABLECOINS = [
  "CADC",
  "USDC",
  "EURC",
  "GBP",
] as const;

export type StablecoinSymbol = (typeof STABLECOINS)[number];

export const ZERION_PERIODS = [
  "hour",
  "day",
  "week",
  "month",
  "3months",
  "6months",
  "year",
  "5years",
  "max",
] as const;

export type ZerionChartPeriod = (typeof ZERION_PERIODS)[number];

export type PriceCurrency =
  | "usd"
  | "cad"
  | "eur"
  | "gbp";

export interface PricePoint {
  timestamp: number;
  price: number;
}

export interface StablecoinPrice {
  symbol: StablecoinSymbol;

  /**
   * Zerion fungible ID.
   * Do not assume this equals the token symbol.
   */
  fungibleId: string;

  currency: PriceCurrency;

  price: number;

  timestamp: number;

  source: "zerion";
}

export interface StablecoinPriceChart {
  symbol: StablecoinSymbol;

  fungibleId: string;

  currency: PriceCurrency;

  period: ZerionChartPeriod;

  points: PricePoint[];

  stats?: {
    first?: number;
    min?: number;
    avg?: number;
    max?: number;
    last?: number;
  };

  source: "zerion";

  fetchedAt: number;
}

export interface SchemaPriceTracking {
  provider: "zerion";

  assets: Record<
    StablecoinSymbol,
    {
      fungibleId: string;
      symbol: StablecoinSymbol;
    }
  >;

  prices: StablecoinPrice[];

  charts?: StablecoinPriceChart[];

  currency: PriceCurrency;

  fetchedAt: number;
}