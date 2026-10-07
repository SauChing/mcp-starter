import React from 'react';
import { YIELD_CURVE_DATA, SOVEREIGN_BONDS } from '../../data/marketData';
import { TrendingUp, TrendingDown, Landmark, AlertCircle } from 'lucide-react';

interface BondsScreenProps {
  onSelectSymbol: (symbol: string) => void;
}

export const BondsScreen: React.FC<BondsScreenProps> = ({ onSelectSymbol }) => {
  // Yield curve calculations
  const yMin = 3.2;
  const yMax = 5.8;
  const svgWidth = 720;
  const svgHeight = 260;
  const pad = { top: 30, right: 30, bottom: 40, left: 45 };

  const usableW = svgWidth - pad.left - pad.right;
  const usableH = svgHeight - pad.top - pad.bottom;

  const getX = (idx: number) => pad.left + (idx / (YIELD_CURVE_DATA.length - 1)) * usableW;
  const getY = (val: number) => pad.top + (1 - (val - yMin) / (yMax - yMin)) * usableH;

  const currentPoints = YIELD_CURVE_DATA.map((p, i) => `${getX(i)},${getY(p.current)}`).join(' ');
  const monthAgoPoints = YIELD_CURVE_DATA.map((p, i) => `${getX(i)},${getY(p.monthAgo)}`).join(' ');
  const yearAgoPoints = YIELD_CURVE_DATA.map((p, i) => `${getX(i)},${getY(p.yearAgo)}`).join(' ');

  // 10Y - 2Y Spread
  const y2 = YIELD_CURVE_DATA.find((p) => p.tenor === '2Y')?.current || 3.96;
  const y10 = YIELD_CURVE_DATA.find((p) => p.tenor === '10Y')?.current || 4.08;
  const spread10_2 = Number((y10 - y2).toFixed(2));

  return (
    <div className="flex flex-col gap-6">
      {/* US Treasury Yield Curve Visualizer */}
      <div className="rounded-xl border border-[#2a2e39] bg-[#1e222d] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#2a2e39]">
          <div>
            <div className="flex items-center gap-2">
              <Landmark className="h-4 w-4 text-[#2962ff]" />
              <h2 className="text-base font-bold text-white tracking-tight">US Treasury Yield Curve</h2>
            </div>
            <p className="text-xs text-[#787b86]">
              Fixed income term structure comparing current rates with historical baselines
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-[#2a2e39] bg-[#131722] px-3 py-1.5 text-xs">
              <span className="text-[#787b86]">10Y - 2Y Spread: </span>
              <span className={`font-mono font-bold ${spread10_2 >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                {spread10_2 >= 0 ? '+' : ''}{spread10_2}% ({spread10_2 >= 0 ? 'Normal' : 'Inverted'})
              </span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center gap-4 text-xs font-mono text-[#787b86]">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-5 bg-[#2962ff] rounded-sm" />
            <span className="text-[#d1d4dc]">Current</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-5 bg-amber-400/80 rounded-sm" />
            <span>1 Month Ago</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-5 bg-purple-400/70 rounded-sm" />
            <span>1 Year Ago</span>
          </div>
        </div>

        {/* SVG Yield Curve Graph */}
        <div className="mt-2 w-full overflow-x-auto no-scrollbar">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto min-w-[550px]">
            {/* Grid Lines */}
            {[3.5, 4.0, 4.5, 5.0, 5.5].map((val) => (
              <g key={val}>
                <line
                  x1={pad.left}
                  y1={getY(val)}
                  x2={svgWidth - pad.right}
                  y2={getY(val)}
                  stroke="#2a2e39"
                  strokeDasharray="2,3"
                />
                <text x={pad.left - 8} y={getY(val) + 4} fill="#787b86" fontSize="10" textAnchor="end" fontFamily="JetBrains Mono, monospace">
                  {val.toFixed(1)}%
                </text>
              </g>
            ))}

            {/* Tenor Labels on Bottom */}
            {YIELD_CURVE_DATA.map((p, i) => (
              <g key={p.tenor}>
                <line
                  x1={getX(i)}
                  y1={svgHeight - pad.bottom}
                  x2={getX(i)}
                  y2={svgHeight - pad.bottom + 4}
                  stroke="#434651"
                />
                <text
                  x={getX(i)}
                  y={svgHeight - pad.bottom + 16}
                  fill="#787b86"
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {p.tenor}
                </text>
              </g>
            ))}

            {/* Year Ago Path */}
            <polyline
              fill="none"
              stroke="#ab47bc"
              strokeWidth="1.8"
              strokeDasharray="4,4"
              opacity="0.8"
              points={yearAgoPoints}
            />

            {/* Month Ago Path */}
            <polyline
              fill="none"
              stroke="#ffb300"
              strokeWidth="2"
              strokeDasharray="3,3"
              opacity="0.85"
              points={monthAgoPoints}
            />

            {/* Current Path */}
            <polyline
              fill="none"
              stroke="#2962ff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={currentPoints}
            />

            {/* Current Data Points */}
            {YIELD_CURVE_DATA.map((p, i) => (
              <g key={`pt-${p.tenor}`}>
                <circle cx={getX(i)} cy={getY(p.current)} r="4" fill="#131722" stroke="#2962ff" strokeWidth="2.5" />
                <text
                  x={getX(i)}
                  y={getY(p.current) - 8}
                  fill="#ffffff"
                  fontSize="9.5"
                  textAnchor="middle"
                  fontWeight="600"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {p.current.toFixed(2)}%
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Global Sovereign Bonds Table */}
      <div className="rounded-xl border border-[#2a2e39] bg-[#1e222d] p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#2a2e39]">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Global 10-Year Sovereign Benchmark Bonds</h2>
            <p className="text-xs text-[#787b86]">Risk-free rates from world major central bank jurisdictions</p>
          </div>
        </div>

        <div className="mt-3 overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2a2e39] text-[#787b86] font-medium">
                <th className="py-2.5 px-3">Sovereign Debt</th>
                <th className="py-2.5 px-3 text-right">Yield</th>
                <th className="py-2.5 px-3 text-right">Change (bps)</th>
                <th className="py-2.5 px-3 text-right hidden sm:table-cell">52W Range</th>
                <th className="py-2.5 px-3 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/50">
              {SOVEREIGN_BONDS.map((bond) => {
                const isPos = bond.changePercent >= 0;
                return (
                  <tr
                    key={bond.symbol}
                    onClick={() => onSelectSymbol(bond.symbol)}
                    className="hover:bg-[#161a25] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-white group-hover:text-[#2962ff] transition-colors">
                          {bond.symbol}
                        </span>
                        <span className="text-[11px] text-[#787b86]">{bond.name}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-white">
                      {bond.price.toFixed(2)}%
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold">
                      <span
                        className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 ${
                          isPos ? 'text-[#089981] bg-[#089981]/15' : 'text-[#f23645] bg-[#f23645]/15'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {(bond.change * 100).toFixed(0)} bps
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[#d1d4dc] hidden sm:table-cell">
                      {bond.range52w?.low.toFixed(2)}% - {bond.range52w?.high.toFixed(2)}%
                    </td>

                    <td className="py-3 px-3 text-right">
                      <svg className="w-16 h-5 ml-auto overflow-visible" viewBox="0 0 60 16">
                        <polyline
                          fill="none"
                          stroke={isPos ? '#089981' : '#f23645'}
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={bond.sparkline
                            .map((val, i) => {
                              const min = Math.min(...bond.sparkline);
                              const max = Math.max(...bond.sparkline);
                              const range = max - min || 1;
                              const x = (i / (bond.sparkline.length - 1)) * 58 + 1;
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
