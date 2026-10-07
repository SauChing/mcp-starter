import React from 'react';
import { COMMODITIES_DATA } from '../../data/marketData';
import { TrendingUp, TrendingDown, Flame, Shield, Droplets } from 'lucide-react';

interface FuturesScreenProps {
  onSelectSymbol: (symbol: string) => void;
}

export const FuturesScreen: React.FC<FuturesScreenProps> = ({ onSelectSymbol }) => {
  const energyFutures = COMMODITIES_DATA.filter((c) => c.sector === 'Energy');
  const metalFutures = COMMODITIES_DATA.filter((c) => c.sector === 'Metals');

  return (
    <div className="flex flex-col gap-6">
      {/* Commodities Overview Banner */}
      <div className="rounded-xl border border-[#2a2e39] bg-[#1e222d] p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#2a2e39]">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Commodities & Global Futures</h2>
            <p className="text-xs text-[#787b86]">NYMEX, COMEX, ICE, and CBOT benchmark physical futures</p>
          </div>
          <span className="text-xs font-mono text-[#787b86]">Active Front-Month Contracts</span>
        </div>

        {/* Metals Section */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Shield className="h-4 w-4" />
            <span>Precious & Industrial Metals</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {metalFutures.map((item) => {
              const isPos = item.changePercent >= 0;
              return (
                <div
                  key={item.symbol}
                  onClick={() => onSelectSymbol(item.symbol)}
                  className="rounded-lg border border-[#2a2e39] bg-[#161a25] p-3.5 hover:border-[#434651] transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-sm text-white group-hover:text-[#2962ff] transition-colors">
                        {item.symbol}
                      </span>
                      <div className="text-xs text-[#787b86]">{item.name}</div>
                    </div>
                    <span
                      className={`font-mono text-xs font-bold ${
                        isPos ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPos ? '+' : ''}
                      {item.changePercent.toFixed(2)}%
                    </span>
                  </div>

                  <div className="mt-3 flex items-end justify-between">
                    <span className="font-mono text-lg font-bold text-white">${item.price.toFixed(2)}</span>
                    <svg className="w-16 h-5 overflow-visible" viewBox="0 0 60 16">
                      <polyline
                        fill="none"
                        stroke={isPos ? '#089981' : '#f23645'}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={item.sparkline
                          .map((val, i) => {
                            const min = Math.min(...item.sparkline);
                            const max = Math.max(...item.sparkline);
                            const range = max - min || 1;
                            const x = (i / (item.sparkline.length - 1)) * 58 + 1;
                            const y = 15 - ((val - min) / range) * 14;
                            return `${x},${y}`;
                          })
                          .join(' ')}
                      />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Energy Section */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <Droplets className="h-4 w-4" />
            <span>Energy & Hydrocarbons</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {energyFutures.map((item) => {
              const isPos = item.changePercent >= 0;
              return (
                <div
                  key={item.symbol}
                  onClick={() => onSelectSymbol(item.symbol)}
                  className="rounded-lg border border-[#2a2e39] bg-[#161a25] p-3.5 hover:border-[#434651] transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-sm text-white group-hover:text-[#2962ff] transition-colors">
                        {item.symbol}
                      </span>
                      <div className="text-xs text-[#787b86]">{item.name}</div>
                    </div>
                    <span
                      className={`font-mono text-xs font-bold ${
                        isPos ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPos ? '+' : ''}
                      {item.changePercent.toFixed(2)}%
                    </span>
                  </div>

                  <div className="mt-3 flex items-end justify-between">
                    <span className="font-mono text-lg font-bold text-white">${item.price.toFixed(2)}</span>
                    <svg className="w-16 h-5 overflow-visible" viewBox="0 0 60 16">
                      <polyline
                        fill="none"
                        stroke={isPos ? '#089981' : '#f23645'}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={item.sparkline
                          .map((val, i) => {
                            const min = Math.min(...item.sparkline);
                            const max = Math.max(...item.sparkline);
                            const range = max - min || 1;
                            const x = (i / (item.sparkline.length - 1)) * 58 + 1;
                            const y = 15 - ((val - min) / range) * 14;
                            return `${x},${y}`;
                          })
                          .join(' ')}
                      />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
