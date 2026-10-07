import React from 'react';
import { CRYPTO_DATA } from '../../data/marketData';
import { TrendingUp, TrendingDown, Zap, Coins, PieChart, ShieldAlert } from 'lucide-react';

interface CryptoScreenProps {
  onSelectSymbol: (symbol: string) => void;
}

export const CryptoScreen: React.FC<CryptoScreenProps> = ({ onSelectSymbol }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Top Crypto Macro Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#2a2e39] bg-[#1e222d] p-4">
          <div className="flex items-center justify-between text-xs text-[#787b86]">
            <span>Total Market Cap</span>
            <Coins className="h-4 w-4 text-[#2962ff]" />
          </div>
          <div className="mt-2 font-mono text-lg font-bold text-white">$2.38T</div>
          <div className="mt-1 flex items-center gap-1 font-mono text-xs text-[#089981]">
            <TrendingUp className="h-3 w-3" />
            <span>+2.45% 24h</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#2a2e39] bg-[#1e222d] p-4">
          <div className="flex items-center justify-between text-xs text-[#787b86]">
            <span>24h Trading Volume</span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 font-mono text-lg font-bold text-white">$84.6B</div>
          <div className="mt-1 flex items-center gap-1 font-mono text-xs text-[#089981]">
            <TrendingUp className="h-3 w-3" />
            <span>+12.8% vs avg</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#2a2e39] bg-[#1e222d] p-4">
          <div className="flex items-center justify-between text-xs text-[#787b86]">
            <span>Bitcoin Dominance</span>
            <PieChart className="h-4 w-4 text-orange-400" />
          </div>
          <div className="mt-2 font-mono text-lg font-bold text-white">56.4%</div>
          <div className="mt-1 text-xs text-[#787b86]">ETH Dominance: 14.2%</div>
        </div>

        <div className="rounded-xl border border-[#2a2e39] bg-[#1e222d] p-4">
          <div className="flex items-center justify-between text-xs text-[#787b86]">
            <span>Crypto Fear & Greed</span>
            <ShieldAlert className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 font-mono text-lg font-bold text-emerald-400">64 / 100</div>
          <div className="mt-1 text-xs text-[#787b86]">Greed Sentiment</div>
        </div>
      </div>

      {/* Top Cryptocurrencies Table */}
      <div className="rounded-xl border border-[#2a2e39] bg-[#1e222d] p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#2a2e39]">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Top Digital Assets by Market Cap</h2>
            <p className="text-xs text-[#787b86]">Spot prices, 24-hour volume, and weekly price action</p>
          </div>
        </div>

        <div className="mt-3 overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2a2e39] text-[#787b86] font-medium">
                <th className="py-2.5 px-3">Asset</th>
                <th className="py-2.5 px-3 text-right">Price (USD)</th>
                <th className="py-2.5 px-3 text-right">24h Change</th>
                <th className="py-2.5 px-3 text-right hidden sm:table-cell">Market Cap</th>
                <th className="py-2.5 px-3 text-right hidden md:table-cell">24h Volume</th>
                <th className="py-2.5 px-3 text-center hidden lg:table-cell">Consensus</th>
                <th className="py-2.5 px-3 text-right">7-Day Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/50">
              {CRYPTO_DATA.map((coin) => {
                const isPos = coin.changePercent >= 0;
                return (
                  <tr
                    key={coin.symbol}
                    onClick={() => onSelectSymbol(coin.symbol)}
                    className="hover:bg-[#161a25] transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2a2e39] font-bold text-xs text-white">
                          {coin.symbol.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-white group-hover:text-[#2962ff] transition-colors">
                            {coin.symbol}
                          </span>
                          <span className="text-[11px] text-[#787b86]">{coin.name}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold text-white">
                      ${coin.price > 10 ? coin.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : coin.price.toFixed(4)}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold">
                      <span
                        className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 ${
                          isPos
                            ? 'bg-[#089981]/15 text-[#089981]'
                            : 'bg-[#f23645]/15 text-[#f23645]'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {coin.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono text-[#d1d4dc] hidden sm:table-cell">
                      {coin.marketCap}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono text-[#787b86] hidden md:table-cell">
                      {coin.volume}
                    </td>

                    <td className="py-3.5 px-3 text-center hidden lg:table-cell">
                      <span className="rounded bg-[#089981]/20 px-2 py-0.5 text-[10px] font-bold text-[#089981]">
                        {coin.rating}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <svg className="w-16 h-5 ml-auto overflow-visible" viewBox="0 0 60 16">
                        <polyline
                          fill="none"
                          stroke={isPos ? '#089981' : '#f23645'}
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={coin.sparkline
                            .map((val, i) => {
                              const min = Math.min(...coin.sparkline);
                              const max = Math.max(...coin.sparkline);
                              const range = max - min || 1;
                              const x = (i / (coin.sparkline.length - 1)) * 58 + 1;
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
