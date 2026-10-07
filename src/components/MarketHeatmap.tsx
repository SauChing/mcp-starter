import React, { useState } from 'react';
import { HeatmapSector, HeatmapItem } from '../types/market';
import { HEATMAP_DATA } from '../data/marketData';
import { Filter, Info, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MarketHeatmapProps {
  onSelectSymbol: (symbol: string) => void;
}

export const MarketHeatmap: React.FC<MarketHeatmapProps> = ({ onSelectSymbol }) => {
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string>('All');
  const [hoveredItem, setHoveredItem] = useState<HeatmapItem | null>(null);

  // Performance color mapping following TradingView palette
  const getColorClass = (change: number) => {
    if (change >= 3.0) return 'bg-[#089981] text-white hover:brightness-110';
    if (change >= 1.5) return 'bg-[#107c65] text-white hover:brightness-110';
    if (change >= 0.0) return 'bg-[#195345] text-[#d1d4dc] hover:brightness-115';
    if (change >= -1.5) return 'bg-[#5c2429] text-[#d1d4dc] hover:brightness-115';
    if (change >= -3.0) return 'bg-[#98222d] text-white hover:brightness-110';
    return 'bg-[#f23645] text-white hover:brightness-110';
  };

  const sectorsToDisplay =
    selectedSectorFilter === 'All'
      ? HEATMAP_DATA
      : HEATMAP_DATA.filter((s) => s.name === selectedSectorFilter);

  // Calculate sector aggregate stats
  const totalMarketCap = HEATMAP_DATA.reduce((acc, s) => acc + s.marketCap, 0);

  return (
    <div className="flex flex-col rounded-xl border border-[#2a2e39] bg-[#1e222d] p-4 sm:p-5 shadow-sm">
      {/* Heatmap Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#2a2e39]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">S&P 500 Market Heatmap</h2>
            <span className="text-xs font-mono text-[#787b86]">Total: ${(totalMarketCap / 1000).toFixed(1)}T</span>
          </div>
          <p className="text-xs text-[#787b86] mt-0.5">
            Size indicates market capitalization · Color indicates 1-day percentage change
          </p>
        </div>

        {/* Sector Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full py-1">
          <button
            onClick={() => setSelectedSectorFilter('All')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              selectedSectorFilter === 'All'
                ? 'bg-[#2962ff] text-white'
                : 'text-[#787b86] hover:text-[#d1d4dc] bg-[#131722]'
            }`}
          >
            All Sectors
          </button>
          {HEATMAP_DATA.map((sector) => (
            <button
              key={sector.name}
              onClick={() => setSelectedSectorFilter(sector.name)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                selectedSectorFilter === sector.name
                  ? 'bg-[#2962ff] text-white'
                  : 'text-[#787b86] hover:text-[#d1d4dc] bg-[#131722]'
              }`}
            >
              {sector.name}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Grid Layout */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {sectorsToDisplay.map((sector) => {
          return (
            <div
              key={sector.name}
              className="flex flex-col rounded-lg border border-[#2a2e39] bg-[#161a25] p-3 overflow-hidden"
            >
              {/* Sector Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#d1d4dc] truncate">{sector.name}</span>
                <span
                  className={`text-xs font-mono font-medium ${
                    sector.changePercent >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {sector.changePercent >= 0 ? '+' : ''}
                  {sector.changePercent.toFixed(2)}%
                </span>
              </div>

              {/* Items Treemap-like Flex Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 flex-1 min-h-[160px]">
                {sector.items.map((item) => {
                  const isLarge = item.marketCap >= 1000;
                  const colorClass = getColorClass(item.changePercent);

                  return (
                    <button
                      key={item.symbol}
                      onClick={() => onSelectSymbol(item.symbol)}
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`relative flex flex-col justify-between p-2 rounded transition-all cursor-pointer text-left ${colorClass} ${
                        isLarge ? 'col-span-2 row-span-1 sm:col-span-2' : 'col-span-1'
                      }`}
                    >
                      <div className="flex items-start justify-between w-full">
                        <span className="font-bold text-xs sm:text-sm tracking-tight">{item.symbol}</span>
                        <span className="text-[10px] opacity-80 font-mono hidden sm:inline">
                          ${(item.marketCap >= 1000 ? `${(item.marketCap / 1000).toFixed(1)}T` : `${item.marketCap}B`)}
                        </span>
                      </div>

                      <div className="mt-2 flex items-baseline justify-between w-full">
                        <span className="text-[11px] font-mono opacity-90">${item.price.toFixed(2)}</span>
                        <span className="font-mono text-xs font-bold">
                          {item.changePercent >= 0 ? '+' : ''}
                          {item.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Heatmap Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#2a2e39] text-xs text-[#787b86]">
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span>-3%</span>
          <div className="h-2.5 w-6 rounded-sm bg-[#f23645]" />
          <div className="h-2.5 w-6 rounded-sm bg-[#98222d]" />
          <div className="h-2.5 w-6 rounded-sm bg-[#5c2429]" />
          <div className="h-2.5 w-6 rounded-sm bg-[#195345]" />
          <div className="h-2.5 w-6 rounded-sm bg-[#107c65]" />
          <div className="h-2.5 w-6 rounded-sm bg-[#089981]" />
          <span>+3%</span>
        </div>

        {hoveredItem ? (
          <div className="flex items-center gap-2 text-[#d1d4dc] font-mono text-xs">
            <span className="font-bold">{hoveredItem.symbol}</span>
            <span>{hoveredItem.name}</span>
            <span className="text-[#787b86]">({hoveredItem.subSector})</span>
            <span
              className={hoveredItem.changePercent >= 0 ? 'text-[#089981] font-semibold' : 'text-[#f23645] font-semibold'}
            >
              {hoveredItem.changePercent >= 0 ? '+' : ''}
              {hoveredItem.changePercent.toFixed(2)}%
            </span>
          </div>
        ) : (
          <div className="text-[11px] text-[#787b86]">Hover over any asset or click to launch interactive analysis</div>
        )}
      </div>
    </div>
  );
};
