import React, { useState } from 'react';
import { TickerQuote } from '../../types/market';
import { WORLD_INDICES, EQUITIES_DATA, COMMODITIES_DATA, FOREX_DATA, ECONOMIC_EVENTS, MARKET_NEWS } from '../../data/marketData';
import { MarketHeatmap } from '../MarketHeatmap';
import {
  TrendingUp,
  TrendingDown,
  Globe2,
  Calendar,
  Newspaper,
  Compass,
  ArrowRight,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
} from 'lucide-react';

interface OverviewScreenProps {
  onSelectSymbol: (symbol: string) => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({ onSelectSymbol }) => {
  const [moverTab, setMoverTab] = useState<'gainers' | 'losers' | 'volume'>('gainers');

  // Filter market movers from equities
  const topGainers = [...EQUITIES_DATA].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
  const topLosers = [...EQUITIES_DATA].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
  const mostActive = [...EQUITIES_DATA].sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume)).slice(0, 5);

  const displayedMovers =
    moverTab === 'gainers' ? topGainers : moverTab === 'losers' ? topLosers : mostActive;

  return (
    <div className="flex flex-col gap-6">
      {/* Market Pulse Banner */}
      <div className="rounded-xl border border-[#2a2e39] bg-gradient-to-r from-[#161a25] via-[#1e222d] to-[#161a25] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#089981] animate-pulse" />
              <h1 className="text-xl font-bold tracking-tight text-white">Global Markets Overview</h1>
            </div>
            <p className="mt-1 text-xs text-[#787b86]">
              Real-time snapshot across equities, commodities, digital currencies, and fixed income benchmarks.
            </p>
          </div>

          {/* Market Breadth & Sentiment Indicators */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Fear & Greed Gauge */}
            <div className="flex items-center gap-2.5 rounded-lg border border-[#2a2e39] bg-[#131722] px-3 py-2 text-xs">
              <Compass className="h-4 w-4 text-emerald-400" />
              <div>
                <div className="text-[10px] text-[#787b86] font-medium uppercase">Sentiment Index</div>
                <div className="font-mono font-bold text-emerald-400">68 · Greed</div>
              </div>
            </div>

            {/* US Market Breadth */}
            <div className="flex items-center gap-2.5 rounded-lg border border-[#2a2e39] bg-[#131722] px-3 py-2 text-xs">
              <Globe2 className="h-4 w-4 text-[#2962ff]" />
              <div>
                <div className="text-[10px] text-[#787b86] font-medium uppercase">NYSE / NASDAQ Breadth</div>
                <div className="font-mono text-[#d1d4dc]">
                  <span className="text-[#089981] font-bold">3,140</span> Adv · <span className="text-[#f23645] font-bold">1,890</span> Dec
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* World Indices Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">Major World Indices</h2>
            <span className="text-xs text-[#787b86]">Americas, Europe & Asia</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {WORLD_INDICES.map((idx) => {
            const isPos = idx.changePercent >= 0;
            return (
              <button
                key={idx.symbol}
                onClick={() => onSelectSymbol(idx.symbol)}
                className="group flex flex-col justify-between rounded-xl border border-[#2a2e39] bg-[#1e222d] p-3.5 hover:border-[#434651] hover:bg-[#232734] transition-all text-left"
              >
                <div className="flex items-start justify-between w-full">
                  <div>
                    <span className="font-bold text-sm text-white group-hover:text-[#2962ff] transition-colors">
                      {idx.symbol}
                    </span>
                    <div className="text-xs text-[#787b86] truncate max-w-[120px]">{idx.name}</div>
                  </div>
                  <span className="rounded bg-[#2a2e39] px-1.5 py-0.5 text-[10px] font-mono text-[#787b86]">
                    {idx.country}
                  </span>
                </div>

                <div className="my-2.5 flex items-end justify-between">
                  <div className="font-mono text-base font-bold text-white">
                    {idx.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>

                  {/* Sparkline mini-graph */}
                  <svg className="w-20 h-6 overflow-visible" viewBox="0 0 70 20">
                    <polyline
                      fill="none"
                      stroke={isPos ? '#089981' : '#f23645'}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={idx.sparkline
                        .map((val, i) => {
                          const min = Math.min(...idx.sparkline);
                          const max = Math.max(...idx.sparkline);
                          const range = max - min || 1;
                          const x = (i / (idx.sparkline.length - 1)) * 68 + 1;
                          const y = 18 - ((val - min) / range) * 16;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                    />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-xs font-mono">
                  <div
                    className={`flex items-center gap-0.5 font-semibold ${
                      isPos ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isPos ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                    <span>
                      {isPos ? '+' : ''}
                      {idx.changePercent.toFixed(2)}%
                    </span>
                  </div>
                  <span className="text-[11px] text-[#787b86]">Vol: {idx.volume}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* S&P 500 Heatmap Component */}
      <MarketHeatmap onSelectSymbol={onSelectSymbol} />

      {/* Two Column Grid: Market Movers & Economic Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Movers Table (2 Cols) */}
        <div className="lg:col-span-2 rounded-xl border border-[#2a2e39] bg-[#1e222d] p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#2a2e39]">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-400" />
              <h2 className="text-base font-bold text-white tracking-tight">Market Movers</h2>
            </div>

            {/* Movers Tabs */}
            <div className="flex items-center gap-1 bg-[#131722] p-0.5 rounded-lg">
              <button
                onClick={() => setMoverTab('gainers')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  moverTab === 'gainers' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                Top Gainers
              </button>
              <button
                onClick={() => setMoverTab('losers')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  moverTab === 'losers' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                Top Losers
              </button>
              <button
                onClick={() => setMoverTab('volume')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  moverTab === 'volume' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                Most Active
              </button>
            </div>
          </div>

          {/* Movers Table List */}
          <div className="divide-y divide-[#2a2e39]/60">
            {displayedMovers.map((item) => {
              const isPos = item.changePercent >= 0;
              return (
                <div
                  key={item.symbol}
                  onClick={() => onSelectSymbol(item.symbol)}
                  className="flex items-center justify-between py-2.5 px-2 hover:bg-[#161a25] rounded transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-white hover:text-[#2962ff]">{item.symbol}</span>
                      <span className="text-xs text-[#787b86]">{item.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="font-mono text-sm font-semibold text-white">${item.price.toFixed(2)}</div>
                      <div className="text-[11px] font-mono text-[#787b86]">Vol: {item.volume}</div>
                    </div>

                    <div
                      className={`flex min-w-[75px] items-center justify-end font-mono text-xs font-bold ${
                        isPos ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPos ? '+' : ''}
                      {item.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Economic Calendar & Macro Events (1 Col) */}
        <div className="rounded-xl border border-[#2a2e39] bg-[#1e222d] p-4 sm:p-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#2a2e39]">
            <Calendar className="h-4 w-4 text-[#2962ff]" />
            <h2 className="text-base font-bold text-white tracking-tight">Economic Calendar</h2>
          </div>

          <div className="mt-3 flex flex-col gap-2.5">
            {ECONOMIC_EVENTS.map((ev) => (
              <div key={ev.id} className="rounded-lg border border-[#2a2e39] bg-[#161a25] p-2.5 text-xs">
                <div className="flex items-center justify-between text-[11px] text-[#787b86] mb-1 font-mono">
                  <span>
                    {ev.flag} {ev.country} · {ev.date} {ev.time}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.2 text-[9px] font-bold uppercase ${
                      ev.importance === 'high' ? 'bg-[#f23645]/20 text-[#f23645]' : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {ev.importance}
                  </span>
                </div>
                <div className="font-semibold text-white">{ev.event}</div>
                {ev.forecast && (
                  <div className="mt-1 flex gap-3 text-[11px] font-mono text-[#787b86]">
                    <span>Forecast: <strong className="text-[#d1d4dc]">{ev.forecast}</strong></span>
                    {ev.previous && <span>Prev: <strong className="text-[#d1d4dc]">{ev.previous}</strong></span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Snapshot Bar: Commodities & Currencies */}
      <div className="rounded-xl border border-[#2a2e39] bg-[#1e222d] p-4 sm:p-5">
        <h2 className="text-base font-bold text-white tracking-tight mb-3">Commodities & Forex Benchmark Tickers</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {[...COMMODITIES_DATA.slice(0, 3), ...FOREX_DATA.slice(0, 3)].map((item) => {
            const isPos = item.changePercent >= 0;
            return (
              <button
                key={item.symbol}
                onClick={() => onSelectSymbol(item.symbol)}
                className="flex flex-col rounded-lg border border-[#2a2e39] bg-[#161a25] p-2.5 text-left hover:border-[#434651] transition-colors"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">{item.symbol}</span>
                  <span
                    className={`font-mono text-[11px] font-semibold ${
                      isPos ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isPos ? '+' : ''}
                    {item.changePercent.toFixed(2)}%
                  </span>
                </div>
                <div className="mt-1 font-mono text-sm font-semibold text-[#d1d4dc]">
                  {item.price > 100 ? item.price.toFixed(2) : item.price.toFixed(4)}
                </div>
                <div className="text-[10px] text-[#787b86] truncate mt-0.5">{item.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Financial News Stream Preview */}
      <div className="rounded-xl border border-[#2a2e39] bg-[#1e222d] p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#2a2e39]">
          <div className="flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-[#2962ff]" />
            <h2 className="text-base font-bold text-white tracking-tight">Market News & Analysis</h2>
          </div>
          <span className="text-xs text-[#787b86]">Updated continuously</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          {MARKET_NEWS.slice(0, 3).map((news) => (
            <div key={news.id} className="flex flex-col justify-between rounded-lg border border-[#2a2e39] bg-[#161a25] p-3.5">
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#787b86] mb-1.5">
                  <span className="font-semibold text-[#2962ff]">{news.source}</span>
                  <span>{news.timeAgo}</span>
                </div>
                <h3 className="font-semibold text-xs sm:text-sm text-white hover:text-[#2962ff] transition-colors leading-snug">
                  {news.title}
                </h3>
                <p className="mt-1.5 text-xs text-[#787b86] line-clamp-2 leading-relaxed">
                  {news.summary}
                </p>
              </div>

              <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-[#2a2e39]/60">
                {news.relatedSymbols.map((sym) => (
                  <button
                    key={sym}
                    onClick={() => onSelectSymbol(sym)}
                    className="rounded bg-[#2a2e39] px-1.5 py-0.5 text-[10px] font-mono font-medium text-[#d1d4dc] hover:bg-[#2962ff] hover:text-white transition-colors"
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
