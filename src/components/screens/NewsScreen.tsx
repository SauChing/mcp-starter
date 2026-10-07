import React, { useState } from 'react';
import { MARKET_NEWS } from '../../data/marketData';
import { Newspaper, Filter, Clock, ExternalLink } from 'lucide-react';

interface NewsScreenProps {
  onSelectSymbol: (symbol: string) => void;
}

export const NewsScreen: React.FC<NewsScreenProps> = ({ onSelectSymbol }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Stocks', 'Commodities', 'Crypto', 'Indices', 'Futures'];

  const filteredNews =
    activeCategory === 'All'
      ? MARKET_NEWS
      : MARKET_NEWS.filter((n) => n.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-[#2a2e39] bg-[#1e222d] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#2a2e39]">
          <div>
            <div className="flex items-center gap-2">
              <Newspaper className="h-4 w-4 text-[#2962ff]" />
              <h2 className="text-base font-bold text-white tracking-tight">Market News & Editorial Feed</h2>
            </div>
            <p className="text-xs text-[#787b86]">Curated real-time updates from global financial wires</p>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-[#2962ff] text-white'
                    : 'text-[#787b86] hover:text-[#d1d4dc] bg-[#131722]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-col divide-y divide-[#2a2e39]/60">
          {filteredNews.map((article) => {
            return (
              <div key={article.id} className="py-4 first:pt-0 last:pb-0 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-[#787b86]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#2962ff]">{article.source}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="h-3 w-3" />
                      {article.timeAgo}
                    </span>
                    <span>·</span>
                    <span>{article.category}</span>
                  </div>

                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                      article.sentiment === 'bullish'
                        ? 'bg-[#089981]/20 text-[#089981]'
                        : article.sentiment === 'bearish'
                        ? 'bg-[#f23645]/20 text-[#f23645]'
                        : 'bg-[#2a2e39] text-[#787b86]'
                    }`}
                  >
                    {article.sentiment}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-semibold text-white hover:text-[#2962ff] transition-colors leading-snug cursor-pointer">
                  {article.title}
                </h3>

                <p className="text-xs text-[#787b86] leading-relaxed">{article.summary}</p>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-[#787b86]">Tagged Symbols:</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {article.relatedSymbols.map((sym) => (
                      <button
                        key={sym}
                        onClick={() => onSelectSymbol(sym)}
                        className="rounded bg-[#161a25] border border-[#2a2e39] px-2 py-0.5 text-[11px] font-mono font-medium text-[#d1d4dc] hover:border-[#2962ff] hover:text-[#2962ff] transition-colors"
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
