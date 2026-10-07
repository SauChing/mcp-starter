import React, { useState, useMemo, useRef } from 'react';
import { Candle, Timeframe } from '../types/market';
import { generateCandles } from '../data/marketData';
import { BarChart2, TrendingUp, Activity, Layers, Maximize2 } from 'lucide-react';

interface InteractiveChartProps {
  symbol: string;
  basePrice: number;
  changePercent: number;
  height?: number;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  symbol,
  basePrice,
  changePercent,
  height = 420,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [chartType, setChartType] = useState<'candlestick' | 'area'>('candlestick');
  const [showVolume, setShowVolume] = useState<boolean>(true);
  const [showMA20, setShowMA20] = useState<boolean>(true);
  const [showMA50, setShowMA50] = useState<boolean>(false);
  const [showBollinger, setShowBollinger] = useState<boolean>(false);
  const [showRSI, setShowRSI] = useState<boolean>(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Generate or memoize candles for the selected timeframe
  const candles = useMemo(() => {
    return generateCandles(basePrice, timeframe, changePercent / 100);
  }, [basePrice, timeframe, changePercent]);

  // Compute Moving Averages and Bollinger Bands
  const calculatedData = useMemo(() => {
    const ma20: (number | null)[] = [];
    const ma50: (number | null)[] = [];
    const upperBB: (number | null)[] = [];
    const lowerBB: (number | null)[] = [];
    const rsiValues: (number | null)[] = [];

    // MA20 & Bollinger
    for (let i = 0; i < candles.length; i++) {
      if (i < 19) {
        ma20.push(null);
        upperBB.push(null);
        lowerBB.push(null);
      } else {
        const slice = candles.slice(i - 19, i + 1).map((c) => c.close);
        const sum = slice.reduce((a, b) => a + b, 0);
        const mean = sum / 20;
        ma20.push(mean);

        const variance = slice.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / 20;
        const stdDev = Math.sqrt(variance);
        upperBB.push(mean + stdDev * 2);
        lowerBB.push(mean - stdDev * 2);
      }

      if (i < 49) {
        ma50.push(null);
      } else {
        const slice50 = candles.slice(i - 49, i + 1).map((c) => c.close);
        const sum50 = slice50.reduce((a, b) => a + b, 0);
        ma50.push(sum50 / 50);
      }

      // Simplified RSI (14 period)
      if (i < 14) {
        rsiValues.push(50);
      } else {
        let gains = 0;
        let losses = 0;
        for (let j = i - 13; j <= i; j++) {
          const diff = candles[j].close - candles[j - 1].close;
          if (diff >= 0) gains += diff;
          else losses += Math.abs(diff);
        }
        const rs = losses === 0 ? 100 : gains / losses;
        const rsi = 100 - 100 / (1 + rs);
        rsiValues.push(rsi);
      }
    }

    return { ma20, ma50, upperBB, lowerBB, rsiValues };
  }, [candles]);

  // Viewport geometry
  const width = 800; // SVG viewBox coordinates
  const svgHeight = height;
  const padding = { top: 20, right: 65, bottom: showRSI ? 85 : 30, left: 15 };
  const rsiHeight = showRSI ? 55 : 0;
  const mainChartHeight = svgHeight - padding.top - padding.bottom;

  // Price Extents
  const minPrice = useMemo(() => {
    let min = Math.min(...candles.map((c) => c.low));
    if (showBollinger) {
      calculatedData.lowerBB.forEach((v) => {
        if (v !== null && v < min) min = v;
      });
    }
    return min * 0.995;
  }, [candles, showBollinger, calculatedData]);

  const maxPrice = useMemo(() => {
    let max = Math.max(...candles.map((c) => c.high));
    if (showBollinger) {
      calculatedData.upperBB.forEach((v) => {
        if (v !== null && v > max) max = v;
      });
    }
    return max * 1.005;
  }, [candles, showBollinger, calculatedData]);

  const maxVolume = useMemo(() => {
    return Math.max(...candles.map((c) => c.volume), 1);
  }, [candles]);

  // Coordinate scales
  const getX = (index: number) => {
    const usableWidth = width - padding.left - padding.right;
    return padding.left + (index / (candles.length - 1)) * usableWidth;
  };

  const getY = (price: number) => {
    const range = maxPrice - minPrice || 1;
    return padding.top + (1 - (price - minPrice) / range) * mainChartHeight;
  };

  const getVolY = (vol: number) => {
    const volMaxHeight = mainChartHeight * 0.22;
    return padding.top + mainChartHeight - (vol / maxVolume) * volMaxHeight;
  };

  const getRSIY = (rsi: number) => {
    const rsiTop = svgHeight - padding.bottom + 15;
    return rsiTop + (1 - rsi / 100) * (rsiHeight - 10);
  };

  // Active Candle for inspector bar
  const activeCandle = hoverIndex !== null && candles[hoverIndex] ? candles[hoverIndex] : candles[candles.length - 1];
  const activeIndex = hoverIndex !== null ? hoverIndex : candles.length - 1;
  const activeMA20 = calculatedData.ma20[activeIndex];
  const activeMA50 = calculatedData.ma50[activeIndex];
  const activeRSI = calculatedData.rsiValues[activeIndex];

  // Mouse interaction handler
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const ratio = clientX / rect.width;
    const svgX = ratio * width;

    const usableWidth = width - padding.left - padding.right;
    const indexRatio = (svgX - padding.left) / usableWidth;
    let idx = Math.round(indexRatio * (candles.length - 1));
    idx = Math.max(0, Math.min(candles.length - 1, idx));
    setHoverIndex(idx);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  // Area Path
  const areaPath = useMemo(() => {
    if (candles.length === 0) return '';
    let d = `M ${getX(0)} ${getY(candles[0].close)}`;
    for (let i = 1; i < candles.length; i++) {
      d += ` L ${getX(i)} ${getY(candles[i].close)}`;
    }
    const bottomY = padding.top + mainChartHeight;
    const fillD = `${d} L ${getX(candles.length - 1)} ${bottomY} L ${getX(0)} ${bottomY} Z`;
    return { lineD: d, fillD };
  }, [candles, minPrice, maxPrice]);

  return (
    <div ref={containerRef} className="flex flex-col w-full rounded-lg bg-[#131722] border border-[#2a2e39] overflow-hidden select-none">
      {/* Chart Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#2a2e39] bg-[#1e222d] px-3 py-2 text-xs">
        {/* Timeframe Toggles */}
        <div className="flex items-center gap-1">
          {(['1D', '5D', '1M', '6M', '1Y', 'ALL'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                timeframe === tf
                  ? 'bg-[#2962ff] text-white font-semibold'
                  : 'text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#2a2e39]'
              }`}
            >
              {tf}
            </button>
          ))}

          <div className="mx-1 h-3.5 w-px bg-[#2a2e39]" />

          {/* Chart Style Toggle */}
          <button
            onClick={() => setChartType((prev) => (prev === 'candlestick' ? 'area' : 'candlestick'))}
            className={`px-2 py-1 rounded font-medium transition-colors flex items-center gap-1 ${
              chartType === 'candlestick'
                ? 'bg-[#2a2e39] text-[#d1d4dc]'
                : 'text-[#787b86] hover:text-[#d1d4dc]'
            }`}
            title="Toggle Candlestick / Area"
          >
            <BarChart2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{chartType === 'candlestick' ? 'Candles' : 'Area'}</span>
          </button>
        </div>

        {/* Indicator Toggles */}
        <div className="flex items-center gap-1.5 mt-1 sm:mt-0">
          <button
            onClick={() => setShowMA20((prev) => !prev)}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
              showMA20
                ? 'bg-[#ff9800]/20 text-[#ff9800] ring-1 ring-[#ff9800]/50'
                : 'text-[#787b86] hover:text-[#d1d4dc]'
            }`}
            title="Moving Average 20"
          >
            MA 20
          </button>
          <button
            onClick={() => setShowMA50((prev) => !prev)}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
              showMA50
                ? 'bg-[#2962ff]/20 text-[#2962ff] ring-1 ring-[#2962ff]/50'
                : 'text-[#787b86] hover:text-[#d1d4dc]'
            }`}
            title="Moving Average 50"
          >
            MA 50
          </button>
          <button
            onClick={() => setShowBollinger((prev) => !prev)}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
              showBollinger
                ? 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/50'
                : 'text-[#787b86] hover:text-[#d1d4dc]'
            }`}
            title="Bollinger Bands"
          >
            BB (20,2)
          </button>
          <button
            onClick={() => setShowVolume((prev) => !prev)}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
              showVolume
                ? 'bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/50'
                : 'text-[#787b86] hover:text-[#d1d4dc]'
            }`}
            title="Toggle Volume"
          >
            Vol
          </button>
          <button
            onClick={() => setShowRSI((prev) => !prev)}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
              showRSI
                ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50'
                : 'text-[#787b86] hover:text-[#d1d4dc]'
            }`}
            title="Relative Strength Index"
          >
            RSI
          </button>
        </div>
      </div>

      {/* Real-time OHLCV Bar Overlay */}
      {activeCandle && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-[#2a2e39]/60 bg-[#161a25] px-3 py-1.5 text-[11px] font-mono">
          <span className="text-[#787b86]">{activeCandle.time}</span>
          <div>
            <span className="text-[#787b86]">O </span>
            <span className="text-[#d1d4dc]">{activeCandle.open.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-[#787b86]">H </span>
            <span className="text-[#089981]">{activeCandle.high.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-[#787b86]">L </span>
            <span className="text-[#f23645]">{activeCandle.low.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-[#787b86]">C </span>
            <span
              className={activeCandle.close >= activeCandle.open ? 'text-[#089981] font-semibold' : 'text-[#f23645] font-semibold'}
            >
              {activeCandle.close.toFixed(2)}
            </span>
          </div>
          {showVolume && (
            <div>
              <span className="text-[#787b86]">Vol </span>
              <span className="text-cyan-300">{(activeCandle.volume / 1000).toFixed(0)}k</span>
            </div>
          )}
          {showMA20 && activeMA20 !== null && (
            <div className="text-[#ff9800]">
              <span className="text-[#ff9800]/70">MA20 </span>
              <span>{activeMA20.toFixed(2)}</span>
            </div>
          )}
          {showMA50 && activeMA50 !== null && (
            <div className="text-[#2962ff]">
              <span className="text-[#2962ff]/70">MA50 </span>
              <span>{activeMA50.toFixed(2)}</span>
            </div>
          )}
          {showRSI && activeRSI !== null && (
            <div className="text-emerald-400">
              <span className="text-emerald-400/70">RSI(14) </span>
              <span>{activeRSI.toFixed(1)}</span>
            </div>
          )}
        </div>
      )}

      {/* Main SVG Chart Canvas */}
      <div className="relative w-full cursor-crosshair">
        <svg
          viewBox={`0 0 ${width} ${svgHeight}`}
          className="w-full h-auto select-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            {/* Area gradient */}
            <linearGradient id={`chart-grad-${symbol}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2962ff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#2962ff" stopOpacity="0.0" />
            </linearGradient>

            {/* Grid pattern */}
            <pattern id="grid-pattern" width="80" height="40" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 40" fill="none" stroke="#2a2e39" strokeWidth="0.5" strokeOpacity="0.3" />
            </pattern>
          </defs>

          {/* Background Grid */}
          <rect x={padding.left} y={padding.top} width={width - padding.left - padding.right} height={mainChartHeight} fill="url(#grid-pattern)" />

          {/* Horizontal Price Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const priceVal = minPrice + (maxPrice - minPrice) * (1 - pct);
            const yPos = padding.top + pct * mainChartHeight;
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={yPos}
                  x2={width - padding.right}
                  y2={yPos}
                  stroke="#2a2e39"
                  strokeDasharray="2,4"
                  strokeWidth="0.8"
                />
                <text
                  x={width - padding.right + 6}
                  y={yPos + 3}
                  fill="#787b86"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {priceVal > 100 ? priceVal.toFixed(1) : priceVal.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Volume Bars */}
          {showVolume &&
            candles.map((c, i) => {
              const x = getX(i);
              const barWidth = Math.max(2, (width / candles.length) * 0.6);
              const y = getVolY(c.volume);
              const barHeight = padding.top + mainChartHeight - y;
              const isUp = c.close >= c.open;
              return (
                <rect
                  key={`vol-${i}`}
                  x={x - barWidth / 2}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={isUp ? '#089981' : '#f23645'}
                  opacity={0.3}
                />
              );
            })}

          {/* Bollinger Bands Fill */}
          {showBollinger && (
            <path
              d={(() => {
                let upperPoints = '';
                let lowerPoints = '';
                for (let i = 0; i < candles.length; i++) {
                  const up = calculatedData.upperBB[i];
                  const low = calculatedData.lowerBB[i];
                  if (up !== null && low !== null) {
                    const x = getX(i);
                    upperPoints += `${upperPoints ? ' L' : 'M'} ${x} ${getY(up)}`;
                    lowerPoints = ` L ${x} ${getY(low)}` + lowerPoints;
                  }
                }
                return upperPoints ? upperPoints + lowerPoints + ' Z' : '';
              })()}
              fill="#9c27b0"
              fillOpacity="0.08"
            />
          )}

          {/* Area Chart Mode */}
          {chartType === 'area' && areaPath && (
            <>
              <path d={areaPath.fillD} fill={`url(#chart-grad-${symbol})`} />
              <path d={areaPath.lineD} fill="none" stroke="#2962ff" strokeWidth="2" />
            </>
          )}

          {/* Candlestick Chart Mode */}
          {chartType === 'candlestick' &&
            candles.map((c, i) => {
              const x = getX(i);
              const isUp = c.close >= c.open;
              const bodyTop = getY(Math.max(c.open, c.close));
              const bodyBottom = getY(Math.min(c.open, c.close));
              const bodyHeight = Math.max(1.5, bodyBottom - bodyTop);
              const wickTop = getY(c.high);
              const wickBottom = getY(c.low);
              const candleWidth = Math.max(3, (width / candles.length) * 0.65);

              return (
                <g key={`candle-${i}`}>
                  {/* High/Low Wick */}
                  <line
                    x1={x}
                    y1={wickTop}
                    x2={x}
                    y2={wickBottom}
                    stroke={isUp ? '#089981' : '#f23645'}
                    strokeWidth="1.2"
                  />
                  {/* Candle Body */}
                  <rect
                    x={x - candleWidth / 2}
                    y={bodyTop}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={isUp ? '#089981' : '#f23645'}
                    rx="0.5"
                  />
                </g>
              );
            })}

          {/* Moving Average 20 */}
          {showMA20 && (
            <path
              d={calculatedData.ma20.reduce((acc, val, i) => {
                if (val === null) return acc;
                const cmd = acc === '' ? 'M' : 'L';
                return `${acc} ${cmd} ${getX(i)} ${getY(val)}`;
              }, '')}
              fill="none"
              stroke="#ff9800"
              strokeWidth="1.5"
            />
          )}

          {/* Moving Average 50 */}
          {showMA50 && (
            <path
              d={calculatedData.ma50.reduce((acc, val, i) => {
                if (val === null) return acc;
                const cmd = acc === '' ? 'M' : 'L';
                return `${acc} ${cmd} ${getX(i)} ${getY(val)}`;
              }, '')}
              fill="none"
              stroke="#2962ff"
              strokeWidth="1.5"
            />
          )}

          {/* RSI Sub-Panel */}
          {showRSI && (
            <g>
              <line
                x1={padding.left}
                y1={svgHeight - padding.bottom + 10}
                x2={width - padding.right}
                y2={svgHeight - padding.bottom + 10}
                stroke="#2a2e39"
                strokeWidth="1"
              />
              {/* Overbought 70 line */}
              <line
                x1={padding.left}
                y1={getRSIY(70)}
                x2={width - padding.right}
                y2={getRSIY(70)}
                stroke="#f23645"
                strokeDasharray="2,2"
                strokeWidth="0.7"
                strokeOpacity="0.6"
              />
              <text x={width - padding.right + 6} y={getRSIY(70) + 3} fill="#787b86" fontSize="9">
                70
              </text>
              {/* Oversold 30 line */}
              <line
                x1={padding.left}
                y1={getRSIY(30)}
                x2={width - padding.right}
                y2={getRSIY(30)}
                stroke="#089981"
                strokeDasharray="2,2"
                strokeWidth="0.7"
                strokeOpacity="0.6"
              />
              <text x={width - padding.right + 6} y={getRSIY(30) + 3} fill="#787b86" fontSize="9">
                30
              </text>
              {/* RSI Curve */}
              <path
                d={calculatedData.rsiValues.reduce((acc, val, i) => {
                  if (val === null) return acc;
                  const cmd = acc === '' ? 'M' : 'L';
                  return `${acc} ${cmd} ${getX(i)} ${getRSIY(val)}`;
                }, '')}
                fill="none"
                stroke="#10b981"
                strokeWidth="1.5"
              />
            </g>
          )}

          {/* Interactive Crosshair & Tooltip */}
          {hoverIndex !== null && (
            <g>
              {/* Vertical Crosshair Line */}
              <line
                x1={getX(hoverIndex)}
                y1={padding.top}
                x2={getX(hoverIndex)}
                y2={svgHeight - (showRSI ? 15 : padding.bottom)}
                stroke="#787b86"
                strokeDasharray="3,3"
                strokeWidth="0.9"
              />
              {/* Horizontal Crosshair Line */}
              <line
                x1={padding.left}
                y1={getY(candles[hoverIndex].close)}
                x2={width - padding.right}
                y2={getY(candles[hoverIndex].close)}
                stroke="#787b86"
                strokeDasharray="3,3"
                strokeWidth="0.9"
              />

              {/* Price Tag on Right Axis */}
              <rect
                x={width - padding.right + 2}
                y={getY(candles[hoverIndex].close) - 8}
                width={56}
                height={16}
                fill="#2962ff"
                rx="2"
              />
              <text
                x={width - padding.right + 6}
                y={getY(candles[hoverIndex].close) + 4}
                fill="#ffffff"
                fontSize="10"
                fontWeight="600"
                fontFamily="JetBrains Mono, monospace"
              >
                {candles[hoverIndex].close.toFixed(2)}
              </text>

              {/* Time Tag on Bottom Axis */}
              <rect
                x={getX(hoverIndex) - 24}
                y={padding.top + mainChartHeight + 4}
                width={48}
                height={15}
                fill="#2a2e39"
                rx="2"
              />
              <text
                x={getX(hoverIndex)}
                y={padding.top + mainChartHeight + 15}
                fill="#d1d4dc"
                fontSize="9"
                textAnchor="middle"
                fontFamily="JetBrains Mono, monospace"
              >
                {candles[hoverIndex].time}
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
