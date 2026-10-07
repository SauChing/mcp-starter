import React from 'react';
import { FOREX_DATA } from '../../data/marketData';
import { TrendingUp, TrendingDown, ArrowRightLeft, DollarSign } from 'lucide-react';

interface ForexScreenProps {
  onSelectSymbol: (symbol: string) => void;
}

export const ForexScreen: React.FC<ForexScreenProps> = ({ onSelectSymbol }) => {
  // Currency relative strength meter
  const currencies = [
    { code: 'USD', strength: 74, status: 'Strong', color: '#2962ff' },
    { code: 'JPY', strength: 68, status: 'Bullish', color: '#089981' },
    { code: 'EUR', strength: 52, status: 'Neutral', color: '#9c27b0' },
    { code: 'GBP', strength: 48, status: 'Neutral', color: '#ff9800' },
    { code: 'CHF', strength: 45, status: 'Soft', color: '#00bcd4' },
    { code: 'AUD', strength: 38, status: 'Weak', color: '#f23645' },
    { code: 'CAD', strength: 35, status: 'Weak', color: '#e91e63' },
  ];

  // Cross Rates Matrix pairs
  const matrixCurrencies = ['EUR', 'USD', 'GBP', 'JPY', 'CHF'];
  const crossRates: Record<string, Record<string, string>> = {
    EUR: { EUR: '--', USD: '1.0974', GBP: '0.8389', JPY: '163.14', CHF: '0.9374' },
    USD: { EUR: '0.9112', USD: '--', GBP: '0.7644', JPY: '148.65', CHF: '0.8542' },
    GBP: { EUR: '1.1920', USD: '1.3082', GBP: '--', JPY: '194.46', CHF: '1.1174' },
    JPY: { EUR: '0.0061', USD: '0.0067', GBP: '0.0051', JPY: '--', CHF: '0.0057' },
    CHF: { EUR: '1.0668', USD: '1.1706', GBP: '0.8949', JPY: '174.02', CHF: '--' },
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Currency Strength Meter Section */}
      <div className="rounded-xl border border-[#2a2e39] bg-[#1e222d] p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#2a2e39]">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Currency Strength Meter</h2>
            <p className="text-xs text-[#787b86]">Aggregated real-time momentum index across G8 sovereign currencies</p>
          </div>
          <span className="text-xs font-mono text-[#787b86]">FX Liquid Index</span>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {currencies.map((c) => (
            <div key={c.code} className="flex flex-col rounded-lg border border-[#2a2e39] bg-[#161a25] p-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">{c.code}</span>
                <span className="text-[11px] font-mono text-[#787b86]">{c.strength}/100</span>
              </div>
              <div className="mt-2 text-xs font-semibold text-white">{c.status}</div>
              <div className="mt-2 h-1.5 w-full bg-[#2a2e39] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${c.strength}%`, backgroundColor: c.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Forex Cross-Rates Matrix */}
      <div className="rounded-xl border border-[#2a2e39] bg-[#1e222d] p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#2a2e39]">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4 text-[#2962ff]" />
            <h2 className="text-base font-bold text-white tracking-tight">Foreign Exchange Cross-Rates Matrix</h2>
          </div>
          <span className="text-xs text-[#787b86]">Click row/col to analyze</span>
        </div>

        <div className="mt-3 overflow-x-auto no-scrollbar">
          <table className="w-full text-center text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2a2e39] text-[#787b86]">
                <th className="py-2.5 px-3 text-left font-semibold">Base \ Quote</th>
                {matrixCurrencies.map((c) => (
                  <th key={c} className="py-2.5 px-3 font-bold text-white">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/50">
              {matrixCurrencies.map((base) => (
                <tr key={base} className="hover:bg-[#161a25]">
                  <td className="py-2.5 px-3 text-left font-bold text-white">{base}</td>
                  {matrixCurrencies.map((quote) => {
                    const val = crossRates[base]?.[quote] || '--';
                    const isDiagonal = base === quote;
                    return (
                      <td
                        key={quote}
                        className={`py-2.5 px-3 font-mono ${
                          isDiagonal ? 'text-[#787b86] bg-[#161a25]/50' : 'text-[#d1d4dc] font-medium'
                        }`}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Major Forex Pairs Table */}
      <div className="rounded-xl border border-[#2a2e39] bg-[#1e222d] p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#2a2e39]">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Major Currency Pairs</h2>
            <p className="text-xs text-[#787b86]">Spot quotes with 24-hour pip spreads and ranges</p>
          </div>
        </div>

        <div className="mt-3 overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2a2e39] text-[#787b86] font-medium">
                <th className="py-2.5 px-3">Pair</th>
                <th className="py-2.5 px-3 text-right">Bid / Last</th>
                <th className="py-2.5 px-3 text-right">24h Change</th>
                <th className="py-2.5 px-3 text-right hidden sm:table-cell">Day Range</th>
                <th className="py-2.5 px-3 text-center hidden md:table-cell">Technical Bias</th>
                <th className="py-2.5 px-3 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/50">
              {FOREX_DATA.map((pair) => {
                const isPos = pair.changePercent >= 0;
                return (
                  <tr
                    key={pair.symbol}
                    onClick={() => onSelectSymbol(pair.symbol)}
                    className="hover:bg-[#161a25] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-white group-hover:text-[#2962ff] transition-colors">
                          {pair.symbol}
                        </span>
                        <span className="text-[11px] text-[#787b86]">{pair.name}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-white">
                      {pair.price.toFixed(4)}
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
                        {pair.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[#d1d4dc] hidden sm:table-cell">
                      {pair.low24h.toFixed(4)} - {pair.high24h.toFixed(4)}
                    </td>

                    <td className="py-3 px-3 text-center hidden md:table-cell">
                      <span className="rounded bg-[#2a2e39] px-2 py-0.5 text-[10px] font-bold text-[#d1d4dc]">
                        {pair.rating}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <svg className="w-16 h-5 ml-auto overflow-visible" viewBox="0 0 60 16">
                        <polyline
                          fill="none"
                          stroke={isPos ? '#089981' : '#f23645'}
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={pair.sparkline
                            .map((val, i) => {
                              const min = Math.min(...pair.sparkline);
                              const max = Math.max(...pair.sparkline);
                              const range = max - min || 1;
                              const x = (i / (pair.sparkline.length - 1)) * 58 + 1;
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
