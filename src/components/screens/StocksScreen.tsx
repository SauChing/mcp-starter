import React, { useState, useMemo } from 'react';
import { TickerQuote } from '../../types/market';
import { EQUITIES_DATA, SECTORS_PERFORMANCE } from '../../data/marketData';
import { Search, ArrowUpDown, TrendingUp, TrendingDown, Filter, SlidersHorizontal } from 'lucide-react';

interface StocksScreenProps {
  onSelectSymbol: (symbol: string) => void;
}

export const StocksScreen: React.FC<StocksScreenProps> = ({ onSelectSymbol }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [sortField, setSortField] = useState<'price' | 'changePercent' | 'marketCap' | 'pe'>('changePercent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filtered and sorted stocks
  const filteredStocks = useMemo(() => {
    return EQUITIES_DATA.filter((stock) => {
      const matchesSearch =
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = selectedSector === 'All' || stock.sector === selectedSector;
      const matchesRating = selectedRating === 'All' || stock.rating === selectedRating;
      return matchesSearch && matchesSector && matchesRating;
    }).sort((a, b) => {
      let valA: number = 0;
      let valB: number = 0;
      if (sortField === 'price') {
        valA = a.price;
        valB = b.price;
      } else if (sortField === 'changePercent') {
        valA = a.changePercent;
        valB = b.changePercent;
      } else if (sortField === 'pe') {
        valA = a.pe || 0;
        valB = b.pe || 0;
      } else if (sortField === 'marketCap') {
        valA = a.marketCap?.includes('T') ? parseFloat(a.marketCap) * 1000 : parseFloat(a.marketCap || '0');
        valB = b.marketCap?.includes('T') ? parseFloat(b.marketCap) * 1000 : parseFloat(b.marketCap || '0');
      }
      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });
  }, [searchQuery, selectedSector, selectedRating, sortField, sortOrder]);

  const toggleSort = (field: 'price' | 'changePercent' | 'marketCap' | 'pe') => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sectorsList = ['All', 'Technology', 'Financials', 'Healthcare', 'Consumer Cyclical', 'Communication Services', 'Energy'];

  return (
    <div className="flex flex-col gap-6">
      {/* Sector Barometer Section */}
      <div className="rounded-xl border border-[#2a2e39] bg-[#1e222d] p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#2a2e39]">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">S&P 500 Sector Performance Barometer</h2>
            <p className="text-xs text-[#787b86]">Ranked by daily change and index weight</p>
          </div>
          <span className="text-xs font-mono text-[#787b86]">11 S&P GICS Sectors</span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SECTORS_PERFORMANCE.map((sec) => {
            const isPos = sec.change >= 0;
            return (
              <div
                key={sec.name}
                className="flex flex-col rounded-lg border border-[#2a2e39] bg-[#161a25] p-3 text-xs"
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-semibold text-white truncate">{sec.name}</span>
                  <span
                    className={`font-mono font-bold ${
                      isPos ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isPos ? '+' : ''}
                    {sec.change.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#787b86]">
                  <span>Index Weight: {sec.weight}</span>
                  <div className="w-24 h-1.5 bg-[#2a2e39] rounded-full overflow-hidden flex">
                    <div
                      className={`h-full ${isPos ? 'bg-[#089981]' : 'bg-[#f23645]'}`}
                      style={{ width: `${Math.min(100, Math.abs(sec.change) * 35)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Advanced Stocks Screener Table */}
      <div className="rounded-xl border border-[#2a2e39] bg-[#1e222d] p-4 sm:p-5">
        {/* Table Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#2a2e39]">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#787b86]" />
              <input
                type="text"
                placeholder="Filter symbol or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-[#2a2e39] bg-[#161a25] pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#787b86] focus:border-[#2962ff] focus:outline-none"
              />
            </div>

            {/* Sector Selector */}
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="rounded-lg border border-[#2a2e39] bg-[#161a25] px-2.5 py-1.5 text-xs text-[#d1d4dc] focus:border-[#2962ff] focus:outline-none"
            >
              {sectorsList.map((sec) => (
                <option key={sec} value={sec}>
                  {sec === 'All' ? 'All Sectors' : sec}
                </option>
              ))}
            </select>

            {/* Rating Selector */}
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="rounded-lg border border-[#2a2e39] bg-[#161a25] px-2.5 py-1.5 text-xs text-[#d1d4dc] focus:border-[#2962ff] focus:outline-none"
            >
              <option value="All">All Technical Ratings</option>
              <option value="Strong Buy">Strong Buy</option>
              <option value="Buy">Buy</option>
              <option value="Neutral">Neutral</option>
            </select>
          </div>

          <div className="text-xs font-mono text-[#787b86]">
            Showing {filteredStocks.length} equities
          </div>
        </div>

        {/* Screener Data Grid */}
        <div className="mt-3 overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2a2e39] text-[#787b86] font-medium">
                <th className="py-2.5 px-3">Symbol & Name</th>
                <th
                  onClick={() => toggleSort('price')}
                  className="py-2.5 px-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1 justify-end font-mono">
                    <span>Last</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('changePercent')}
                  className="py-2.5 px-3 cursor-pointer hover:text-white text-right"
                >
                  <div className="flex items-center gap-1 justify-end font-mono">
                    <span>Chg %</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('marketCap')}
                  className="py-2.5 px-3 cursor-pointer hover:text-white text-right hidden sm:table-cell"
                >
                  <div className="flex items-center gap-1 justify-end font-mono">
                    <span>Market Cap</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('pe')}
                  className="py-2.5 px-3 cursor-pointer hover:text-white text-right hidden md:table-cell"
                >
                  <div className="flex items-center gap-1 justify-end font-mono">
                    <span>P/E</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3 text-right hidden lg:table-cell font-mono">Volume</th>
                <th className="py-2.5 px-3 text-center hidden md:table-cell">Technical Rating</th>
                <th className="py-2.5 px-3 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/50">
              {filteredStocks.map((stock) => {
                const isPos = stock.changePercent >= 0;
                return (
                  <tr
                    key={stock.symbol}
                    onClick={() => onSelectSymbol(stock.symbol)}
                    className="hover:bg-[#161a25] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-white group-hover:text-[#2962ff] transition-colors">
                          {stock.symbol}
                        </span>
                        <span className="text-[11px] text-[#787b86] truncate max-w-[150px]">
                          {stock.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-semibold text-white">
                      ${stock.price.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold">
                      <span
                        className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 ${
                          isPos
                            ? 'bg-[#089981]/15 text-[#089981]'
                            : 'bg-[#f23645]/15 text-[#f23645]'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {stock.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[#d1d4dc] hidden sm:table-cell">
                      {stock.marketCap}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[#d1d4dc] hidden md:table-cell">
                      {stock.pe ? `${stock.pe.toFixed(1)}x` : '--'}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[#787b86] hidden lg:table-cell">
                      {stock.volume}
                    </td>

                    <td className="py-3 px-3 text-center hidden md:table-cell">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          stock.rating?.includes('Buy')
                            ? 'bg-[#089981]/20 text-[#089981]'
                            : 'bg-[#f23645]/20 text-[#f23645]'
                        }`}
                      >
                        {stock.rating}
                      </span>
                    </td>

                    {/* Sparkline */}
                    <td className="py-3 px-3 text-right">
                      <svg className="w-16 h-5 ml-auto overflow-visible" viewBox="0 0 60 16">
                        <polyline
                          fill="none"
                          stroke={isPos ? '#089981' : '#f23645'}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={stock.sparkline
                            .map((val, i) => {
                              const min = Math.min(...stock.sparkline);
                              const max = Math.max(...stock.sparkline);
                              const range = max - min || 1;
                              const x = (i / (stock.sparkline.length - 1)) * 58 + 1;
                              const y = 15 - ((val - min) / range) * 14;
                              return `${x},${y}`;
                            })
                            .join(' ')}
                        />
                      </svg>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
