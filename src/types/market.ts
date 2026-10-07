export type MarketCategory = 
  | 'overview' 
  | 'stocks' 
  | 'crypto' 
  | 'forex' 
  | 'futures' 
  | 'bonds' 
  | 'news';

export type Timeframe = '1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL';

export type TechnicalRating = 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';

export interface Candle {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TickerQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: string;
  marketCap?: string;
  pe?: number;
  rating?: TechnicalRating;
  category: 'index' | 'stock' | 'crypto' | 'forex' | 'future' | 'bond';
  sector?: string;
  country?: string;
  currency?: string;
  sparkline: number[];
  description?: string;
  range52w?: { low: number; high: number };
  eps?: number;
  dividendYield?: number;
  beta?: number;
  history?: Record<Timeframe, Candle[]>;
}

export interface HeatmapItem {
  symbol: string;
  name: string;
  marketCap: number; // in billions
  changePercent: number;
  price: number;
  sector: string;
  subSector?: string;
}

export interface HeatmapSector {
  name: string;
  items: HeatmapItem[];
  marketCap: number;
  changePercent: number;
}

export interface EconomicEvent {
  id: string;
  time: string;
  date: string;
  country: string;
  flag: string;
  event: string;
  importance: 'high' | 'medium' | 'low';
  actual?: string;
  forecast?: string;
  previous?: string;
}

export interface YieldCurvePoint {
  tenor: string;
  current: number;
  monthAgo: number;
  yearAgo: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  sourceIcon?: string;
  timeAgo: string;
  category: string;
  relatedSymbols: string[];
  sentiment: 'bullish' | 'neutral' | 'bearish';
  summary: string;
}

export interface SimulatedPosition {
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  timestamp: number;
}
