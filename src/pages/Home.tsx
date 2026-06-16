import { useEffect, useState } from "react";
import axios from "axios";
import { Coin, GlobalStats } from "@/src/types";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { HeroBand } from "../components/home/HeroBand";
import { Star, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { auth } from "@/src/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"gainers" | "losers" | "picks">("gainers");
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        let globalData = null;
        let coinsData = [];
        let trendingData = [];

        try {
          const globalRes = await axios.get("/api/coins/global");
          globalData = globalRes.data;
        } catch (e) { console.error("Global API failed", e); }

        try {
          const coinsRes = await axios.get("/api/coins/markets?vs_currency=inr");
          coinsData = coinsRes.data;
        } catch (e) { console.error("Markets API failed", e); }

        try {
          const trendingRes = await axios.get("/api/coins/trending");
          if (trendingRes.data && trendingRes.data.coins) {
            trendingData = trendingRes.data.coins.map((c: any) => c.item);
          }
        } catch (e) { console.error("Trending API failed", e); }

        setGlobalStats(globalData);
        if (coinsData && Array.isArray(coinsData)) {
          setCoins(coinsData);
        }
        setTrending(trendingData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center text-muted-foreground animate-pulse text-lg font-semibold tracking-wide">Loading market data...</div>;

  const gainers = [...coins].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 4);
  const losers = [...coins].sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h).slice(0, 4);
  const topCoins = [...coins].slice(0, 25);

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-500">
      
      {/* Ticker */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-full px-4 py-2 mt-4 flex items-center overflow-hidden">
        <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm mr-4 uppercase tracking-widest flex-shrink-0 animate-pulse">LIVE</div>
        <div className="flex gap-8 whitespace-nowrap overflow-x-auto no-scrollbar">
          {coins.slice(0, 10).map(c => (
            <div key={c.id} className="flex items-center gap-2 text-xs font-mono font-medium">
              <span className="text-slate-300">{c.symbol.toUpperCase()}</span>
              <span className="text-white">₹{c.current_price.toLocaleString()}</span>
              <span className={c.price_change_percentage_24h >= 0 ? "text-green-400" : "text-red-400"}>
                {c.price_change_percentage_24h >= 0 ? "▲" : "▼"} {Math.abs(c.price_change_percentage_24h || 0).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <HeroBand globalStats={globalStats} />

      {/* Trending Strip */}
      {trending.length > 0 && (
        <div className="w-full bg-card border rounded-xl overflow-hidden py-3 px-5 shadow-sm flex items-center gap-4">
          <span className="font-bold text-sm whitespace-nowrap text-amber-500 flex items-center gap-2 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" /> Market Movers
          </span>
          <div className="h-6 w-px bg-border"></div>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max space-x-6 pb-2">
              {trending.map((coin) => (
                <div key={coin.id} className="flex items-center gap-2 cursor-pointer hover:bg-muted py-1 px-2 rounded-lg transition-colors">
                  <img src={coin.thumb} alt={coin.name} className="w-5 h-5 rounded-full" />
                  <span className="font-semibold text-sm">{coin.symbol?.toUpperCase()}</span>
                  <Badge variant="outline" className="text-[9px] uppercase tracking-widest text-muted-foreground border-border">#{coin.market_cap_rank}</Badge>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
        </div>
      )}

      {/* Watchlist Banner for Logged-In Users */}
      {isAuthenticated && (
        <div className="bg-card border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold flex items-center gap-2 text-lg"><Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> Your Watchlist</span>
            <Link to="/profile?tab=watchlist" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Manage &rarr;</Link>
          </div>
          <div className="text-sm text-muted-foreground">Manage your watchlist tracking from your profile dashboard.</div>
        </div>
      )}

      {/* Movers */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6 border-b pb-4 overflow-x-auto no-scrollbar">
          <button 
            className={`px-4 py-2 text-sm font-bold rounded-full whitespace-nowrap transition-all ${activeTab === 'gainers' ? 'bg-green-100 text-green-700' : 'text-muted-foreground hover:bg-muted'}`}
            onClick={() => setActiveTab('gainers')}
          >
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></span> Gainers
          </button>
          <button 
            className={`px-4 py-2 text-sm font-bold rounded-full whitespace-nowrap transition-all ${activeTab === 'losers' ? 'bg-red-100 text-red-700' : 'text-muted-foreground hover:bg-muted'}`}
            onClick={() => setActiveTab('losers')}
          >
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-400 mr-2"></span> Losers
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(activeTab === 'gainers' ? gainers : losers).map(c => (
            <div key={c.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50 hover:bg-white hover:shadow-lg transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-3">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${c.price_change_percentage_24h >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {c.price_change_percentage_24h >= 0 ? "▲" : "▼"} {Math.abs(c.price_change_percentage_24h || 0).toFixed(2)}%
                </span>
                <button className="text-slate-300 hover:text-yellow-400 hover:fill-yellow-400 transition-colors">
                  <Star className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <img src={c.image} alt={c.name} className="w-10 h-10 rounded-full" />
                <div>
                  <div className="font-bold text-slate-800">{c.name}</div>
                  <div className="text-xs font-semibold text-slate-500 uppercase">{c.symbol}</div>
                </div>
              </div>
              <div className="font-mono text-xl font-bold tracking-tight text-slate-900">₹{c.current_price.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top 25 Coins Table */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Top Cryptocurrencies</h2>
            <p className="text-sm text-muted-foreground font-medium mt-1">Top 25 by Volume</p>
          </div>
          <Link to="/coins" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View all coins &rarr;</Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap pb-4">
            <thead>
              <tr className="border-b text-slate-500 font-semibold tracking-wide uppercase text-[11px]">
                <th className="pb-3 px-2">#</th>
                <th className="pb-3 px-2">Coin</th>
                <th className="pb-3 px-2 text-right">Price</th>
                <th className="pb-3 px-2 text-right">24h %</th>
                <th className="pb-3 px-2 text-right">Volume</th>
              </tr>
            </thead>
            <tbody>
              {topCoins.map((c, i) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors group cursor-pointer">
                  <td className="py-4 px-2 text-muted-foreground font-mono">{i + 1}</td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-3">
                      <img src={c.image} alt={c.name} className="w-8 h-8 rounded-full" />
                      <div>
                        <div className="font-bold flex items-center gap-2 text-slate-900">
                          {c.name}
                          <Star className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 hover:text-yellow-400 hover:fill-yellow-400 transition-all" />
                        </div>
                        <div className="text-xs font-semibold text-slate-500 uppercase">{c.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-right font-mono font-bold tracking-tight text-slate-900">₹{c.current_price.toLocaleString()}</td>
                  <td className="py-4 px-2 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold font-mono ${c.price_change_percentage_24h >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {c.price_change_percentage_24h >= 0 ? "▲" : "▼"} {Math.abs(c.price_change_percentage_24h || 0).toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-4 px-2 text-right font-mono text-slate-500 font-semibold">₹{c.total_volume.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

