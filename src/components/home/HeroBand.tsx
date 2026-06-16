import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

export function HeroBand({ globalStats }: { globalStats: any }) {
  if (!globalStats) return null;

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 text-white overflow-hidden my-6 shadow-xl relative isolate">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 z-0"></div>
      <div className="relative z-10 px-6 py-8 md:p-10 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
          The Hub for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Crypto Traders</span>
        </h1>
        <p className="text-slate-300 md:text-lg max-w-2xl mx-auto mb-8">
          Real-time intelligence, unbiased exchange comparisons, and breaking crypto news.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/coins" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center">
            Explore Markets <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link to="/compare" className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center">
            Compare Exchanges
          </Link>
        </div>
      </div>
      
      <div className="bg-slate-950/50 border-t border-slate-800 p-4 md:p-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-slate-800">
          <div>
            <div className="text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider">Active Coins</div>
            <div className="font-mono text-xl md:text-2xl font-bold text-white tracking-widest">{globalStats.data.active_cryptocurrencies.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider">Markets</div>
            <div className="font-mono text-xl md:text-2xl font-bold text-white tracking-widest">{globalStats.data.markets.toLocaleString()}</div>
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider">BTC Dominance</div>
            <div className="font-mono text-xl md:text-2xl font-bold text-orange-400 tracking-widest">{globalStats.data.market_cap_percentage?.btc?.toFixed(2)}%</div>
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider">ETH Dominance</div>
            <div className="font-mono text-xl md:text-2xl font-bold text-blue-400 tracking-widest">{globalStats.data.market_cap_percentage?.eth?.toFixed(2)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
