import React, { useState } from 'react';
import { TickerQuote, SimulatedPosition } from '../types/market';
import { InteractiveChart } from './InteractiveChart';
import {
  X,
  Bookmark,
  Check,
  TrendingUp,
  TrendingDown,
  Gauge,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Activity,
} from 'lucide-react';

interface SymbolDetailModalProps {
  quote: TickerQuote;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (symbol: string) => void;
  onExecuteTrade: (symbol: string, side: 'BUY' | 'SELL', quantity: number, price: number) => void;
  currentPosition?: SimulatedPosition;
  portfolioCash: number;
}

export const SymbolDetailModal: React.FC<SymbolDetailModalProps> = ({
  quote,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
  onExecuteTrade,
  currentPosition,
  portfolioCash,
}) => {
  const [orderSide, setOrderSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderQty, setOrderQty] = useState<number>(10);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string | null>(null);

  const isPositive = quote.changePercent >= 0;
  const totalOrderValue = orderQty * quote.price;

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderQty <= 0) return;
    if (orderSide === 'BUY' && totalOrderValue > portfolioCash) {
      alert('Insufficient simulated purchasing power.');
      return;
    }
    onExecuteTrade(quote.symbol, orderSide, orderQty, quote.price);
    setOrderSuccessMsg(`Successfully executed ${orderSide} of ${orderQty} ${quote.symbol} @ $${quote.price.toFixed(2)}`);
    setTimeout(() => {
      setOrderSuccessMsg(null);
    }, 3500);
  };

  // 52-week position calculation
  const low52 = quote.range52w?.low || quote.price * 0.75;
  const high52 = quote.range52w?.high || quote.price * 1.35;
  const rangePct = Math.min(100, Math.max(0, ((quote.price - low52) / (high52 - low52)) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-2 sm:p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative flex flex-col w-full max-w-5xl rounded-xl border border-[#2a2e39] bg-[#1e222d] shadow-2xl overflow-hidden my-auto max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-[#2a2e39] bg-[#161a25] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white tracking-tight">{quote.symbol}</span>
                <span className="text-xs text-[#787b86] hidden sm:inline">{quote.name}</span>
                <span className="rounded bg-[#2a2e39] px-1.5 py-0.5 text-[10px] font-mono text-[#d1d4dc] uppercase">
                  {quote.category}
                </span>
              </div>
              {quote.sector && (
                <div className="text-[11px] text-[#787b86]">
                  {quote.sector} {quote.country && `· ${quote.country}`}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Watchlist Toggle */}
            <button
              onClick={() => onToggleWatchlist(quote.symbol)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                isWatchlisted
                  ? 'border-[#2962ff] bg-[#2962ff]/10 text-[#2962ff]'
                  : 'border-[#2a2e39] bg-[#1e222d] text-[#d1d4dc] hover:border-[#434651]'
              }`}
            >
              {isWatchlisted ? <Check className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
              <span>{isWatchlisted ? 'Watchlisted' : '+ Watchlist'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#787b86] hover:bg-[#2a2e39] hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex flex-col gap-4 p-4 sm:p-6 overflow-y-auto no-scrollbar">
          {/* Price & Summary Header */}
          <div className="flex flex-wrap items-baseline justify-between gap-4 pb-2 border-b border-[#2a2e39]/60">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold font-mono text-white tracking-tight">
                ${quote.price > 100
                  ? quote.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : quote.price.toFixed(4)}
              </span>
              <div
                className={`flex items-center gap-1 text-sm font-semibold font-mono ${
                  isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span>
                  {isPositive ? '+' : ''}
                  {quote.change.toFixed(2)} ({isPositive ? '+' : ''}
                  {quote.changePercent.toFixed(2)}%)
                </span>
                <span className="text-xs text-[#787b86] font-normal ml-1">Today</span>
              </div>
            </div>

            {/* Technical Rating Tag */}
            {quote.rating && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#787b86]">Technical Consensus:</span>
                <span
                  className={`rounded px-2.5 py-0.5 text-xs font-bold ${
                    quote.rating.includes('Buy')
                      ? 'bg-[#089981]/20 text-[#089981] border border-[#089981]/40'
                      : quote.rating.includes('Sell')
                      ? 'bg-[#f23645]/20 text-[#f23645] border border-[#f23645]/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {quote.rating}
                </span>
              </div>
            )}
          </div>

          {/* Interactive Chart Section */}
          <InteractiveChart
            symbol={quote.symbol}
            basePrice={quote.price}
            changePercent={quote.changePercent}
            height={380}
          />

          {/* Two-Column Details: Stats & Simulated Paper Trading */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left 2 Cols: Fundamental & Technical Stats */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* 52-Week Range Bar */}
              <div className="rounded-lg border border-[#2a2e39] bg-[#161a25] p-3.5">
                <div className="flex items-center justify-between text-xs text-[#787b86] mb-1.5 font-mono">
                  <span>52W Low: ${low52.toFixed(2)}</span>
                  <span className="font-semibold text-[#d1d4dc]">Current: ${quote.price.toFixed(2)}</span>
                  <span>52W High: ${high52.toFixed(2)}</span>
                </div>
                <div className="relative h-2 w-full rounded-full bg-[#2a2e39] overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full"
                    style={{ width: `${rangePct}%` }}
                  />
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-lg border border-[#2a2e39] bg-[#161a25] p-3">
                  <div className="text-[11px] text-[#787b86]">Day Range</div>
                  <div className="text-xs font-mono font-medium text-[#d1d4dc] mt-1">
                    ${quote.low24h.toFixed(2)} - ${quote.high24h.toFixed(2)}
                  </div>
                </div>
                <div className="rounded-lg border border-[#2a2e39] bg-[#161a25] p-3">
                  <div className="text-[11px] text-[#787b86]">Volume</div>
                  <div className="text-xs font-mono font-medium text-[#d1d4dc] mt-1">{quote.volume}</div>
                </div>
                <div className="rounded-lg border border-[#2a2e39] bg-[#161a25] p-3">
                  <div className="text-[11px] text-[#787b86]">Market Cap</div>
                  <div className="text-xs font-mono font-medium text-[#d1d4dc] mt-1">
                    {quote.marketCap || '--'}
                  </div>
                </div>
                <div className="rounded-lg border border-[#2a2e39] bg-[#161a25] p-3">
                  <div className="text-[11px] text-[#787b86]">P/E Ratio</div>
                  <div className="text-xs font-mono font-medium text-[#d1d4dc] mt-1">
                    {quote.pe ? `${quote.pe.toFixed(1)}x` : '--'}
                  </div>
                </div>
                <div className="rounded-lg border border-[#2a2e39] bg-[#161a25] p-3">
                  <div className="text-[11px] text-[#787b86]">EPS (TTM)</div>
                  <div className="text-xs font-mono font-medium text-[#d1d4dc] mt-1">
                    {quote.eps ? `$${quote.eps.toFixed(2)}` : '--'}
                  </div>
                </div>
                <div className="rounded-lg border border-[#2a2e39] bg-[#161a25] p-3">
                  <div className="text-[11px] text-[#787b86]">Div Yield</div>
                  <div className="text-xs font-mono font-medium text-[#d1d4dc] mt-1">
                    {quote.dividendYield !== undefined ? `${quote.dividendYield.toFixed(2)}%` : '--'}
                  </div>
                </div>
                <div className="rounded-lg border border-[#2a2e39] bg-[#161a25] p-3">
                  <div className="text-[11px] text-[#787b86]">Beta</div>
                  <div className="text-xs font-mono font-medium text-[#d1d4dc] mt-1">
                    {quote.beta ? quote.beta.toFixed(2) : '--'}
                  </div>
                </div>
                <div className="rounded-lg border border-[#2a2e39] bg-[#161a25] p-3">
                  <div className="text-[11px] text-[#787b86]">Exchange</div>
                  <div className="text-xs font-mono font-medium text-[#d1d4dc] mt-1">NASDAQ / NYSE</div>
                </div>
              </div>

              {/* Company Description */}
              {quote.description && (
                <div className="rounded-lg border border-[#2a2e39] bg-[#161a25] p-3.5 text-xs text-[#787b86] leading-relaxed">
                  <span className="font-semibold text-[#d1d4dc] mr-1">About {quote.name}:</span>
                  {quote.description}
                </div>
              )}
            </div>

            {/* Right Column: Simulated Trading & Active Position */}
            <div className="flex flex-col rounded-lg border border-[#2a2e39] bg-[#161a25] p-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#2a2e39]">
                <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                  <Activity className="h-4 w-4 text-[#2962ff]" />
                  <span>Simulated Paper Execution</span>
                </div>
                <span className="text-[11px] font-mono text-[#787b86]">
                  Buying Power: ${(portfolioCash / 1000).toFixed(1)}k
                </span>
              </div>

              {/* Current Active Position Card */}
              {currentPosition && (
                <div className="mt-3 rounded border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs">
                  <div className="flex justify-between font-semibold text-emerald-400">
                    <span>Position: {currentPosition.quantity} shares</span>
                    <span>
                      {currentPosition.pnl >= 0 ? '+' : ''}${currentPosition.pnl.toFixed(2)} ({currentPosition.pnlPercent.toFixed(2)}%)
                    </span>
                  </div>
                  <div className="text-[11px] text-[#787b86] font-mono mt-0.5">
                    Entry: ${currentPosition.entryPrice.toFixed(2)} · Current: ${quote.price.toFixed(2)}
                  </div>
                </div>
              )}

              {/* Order Form */}
              <form onSubmit={handleOrderSubmit} className="mt-3 flex flex-col gap-3">
                {/* Buy / Sell Selector */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderSide('BUY')}
                    className={`py-2 rounded font-semibold text-xs transition-colors ${
                      orderSide === 'BUY'
                        ? 'bg-[#089981] text-white shadow-sm'
                        : 'bg-[#2a2e39] text-[#787b86] hover:text-[#d1d4dc]'
                    }`}
                  >
                    BUY / LONG
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderSide('SELL')}
                    className={`py-2 rounded font-semibold text-xs transition-colors ${
                      orderSide === 'SELL'
                        ? 'bg-[#f23645] text-white shadow-sm'
                        : 'bg-[#2a2e39] text-[#787b86] hover:text-[#d1d4dc]'
                    }`}
                  >
                    SELL / SHORT
                  </button>
                </div>

                {/* Shares quantity input */}
                <div>
                  <label className="text-[11px] text-[#787b86] font-medium">Quantity (Units)</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={orderQty}
                      onChange={(e) => setOrderQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full rounded border border-[#2a2e39] bg-[#1e222d] px-3 py-1.5 font-mono text-xs text-white focus:border-[#2962ff] focus:outline-none"
                    />
                    <div className="flex gap-1">
                      {[1, 10, 50].map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => setOrderQty(q)}
                          className="rounded border border-[#2a2e39] bg-[#1e222d] px-2 py-1 text-[10px] font-mono text-[#787b86] hover:text-white"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Summary breakdown */}
                <div className="rounded bg-[#1e222d] p-2.5 text-xs font-mono space-y-1">
                  <div className="flex justify-between text-[#787b86]">
                    <span>Execution Price</span>
                    <span className="text-[#d1d4dc]">${quote.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#787b86]">
                    <span>Estimated Total</span>
                    <span className="font-bold text-white">${totalOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className={`mt-1 w-full rounded py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-opacity ${
                    orderSide === 'BUY' ? 'bg-[#089981] hover:opacity-90' : 'bg-[#f23645] hover:opacity-90'
                  }`}
                >
                  Place {orderSide} Order
                </button>

                {orderSuccessMsg && (
                  <div className="rounded bg-emerald-500/10 border border-emerald-500/30 p-2 text-center text-xs text-emerald-400 font-mono">
                    {orderSuccessMsg}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
