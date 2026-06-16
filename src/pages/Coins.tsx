import { useEffect, useState } from "react";
import axios from "axios";
import { Coin } from "@/src/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Coins() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  
  // chart state
  const [chartPeriod, setChartPeriod] = useState<"1" | "7" | "30" | "365">("7");
  const [chartData, setChartData] = useState<any[]>([]);
  const [loadingChart, setLoadingChart] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await axios.get("/api/coins/markets?vs_currency=inr");
        setCoins(res.data);
        
        const token = localStorage.getItem("token");
        if (token) {
          const wRes = await axios.get("/api/watchlist", { headers: { Authorization: `Bearer ${token}`} });
          setWatchlist(wRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (selectedCoin) {
      loadChart(selectedCoin.id, chartPeriod);
    }
  }, [selectedCoin, chartPeriod]);

  const loadChart = async (id: string, days: string) => {
    setLoadingChart(true);
    try {
      const res = await axios.get(`/api/coins/${id}/market_chart?days=${days}&vs_currency=inr`);
      const formatted = res.data.prices.map((p: [number, number]) => ({ value: p[1], index: p[0] }));
      setChartData(formatted);
    } catch (err) {
      console.error(err);
      setChartData([]);
    } finally {
      setLoadingChart(false);
    }
  };

  const handleWatchlist = async (e: React.MouseEvent, coinId: string) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      toast("Please login to use watchlists.");
      return;
    }
    
    try {
      const isWatchlisted = watchlist.includes(coinId);
      if (isWatchlisted) {
        await axios.delete(`/api/watchlist/${coinId}`, { headers: { Authorization: `Bearer ${token}`} });
        setWatchlist(prev => prev.filter(id => id !== coinId));
        toast("Removed from watchlist");
      } else {
        await axios.post("/api/watchlist", { coin_id: coinId }, { headers: { Authorization: `Bearer ${token}`} });
        setWatchlist(prev => [...prev, coinId]);
        toast("Added to watchlist");
      }
    } catch (err) {
      toast("Failed to update watchlist");
    }
  };

  const filteredCoins = coins.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border">
        <h1 className="text-2xl font-bold tracking-tight">Cryptocurrency Prices</h1>
        <Input 
          placeholder="Search coin..." 
          className="max-w-xs" 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
      </div>

      <div className="border rounded-xl bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Coin</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">24h Change</TableHead>
              <TableHead className="text-right hidden md:table-cell">Market Cap</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-48 animate-pulse text-muted-foreground">Loading coins...</TableCell>
              </TableRow>
            ) : filteredCoins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-48 text-muted-foreground">No coins found</TableCell>
              </TableRow>
            ) : (
              filteredCoins.map((coin) => (
                <TableRow 
                  key={coin.id} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedCoin(coin)}
                >
                  <TableCell>
                    <Button variant="ghost" size="icon" className="w-8 h-8" onClick={(e) => handleWatchlist(e, coin.id)}>
                       <Star className={`w-4 h-4 ${watchlist.includes(coin.id) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`} />
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium text-muted-foreground">{coin.market_cap_rank}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                      <span className="font-semibold">{coin.name}</span>
                      <Badge variant="outline" className="text-[10px] uppercase hidden sm:inline-flex">{coin.symbol}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm tracking-tighter font-medium">
                    ₹{coin.current_price.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm tracking-tighter">
                    <span className={coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}>
                      {coin.price_change_percentage_24h > 0 ? "+" : ""}{coin.price_change_percentage_24h?.toFixed(2)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-muted-foreground hidden md:table-cell">
                    ₹{coin.market_cap.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Coin Detail Modal */}
      <Dialog open={!!selectedCoin} onOpenChange={(open) => !open && setSelectedCoin(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedCoin && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-2xl font-bold">
                    <img src={selectedCoin.image} alt={selectedCoin.name} className="w-8 h-8 rounded-full" />
                    {selectedCoin.name}
                    <Badge variant="secondary" className="uppercase text-muted-foreground">{selectedCoin.symbol}</Badge>
                  </div>
                  <Button variant="ghost" size="icon" onClick={(e) => handleWatchlist(e, selectedCoin.id)}>
                    <Star className={`w-5 h-5 ${watchlist.includes(selectedCoin.id) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`} />
                  </Button>
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-3xl font-bold font-mono tracking-tighter">₹{selectedCoin.current_price.toLocaleString()}</div>
                    <div className={selectedCoin.price_change_percentage_24h >= 0 ? "text-green-500 font-medium font-mono text-sm mt-1" : "text-red-500 font-medium text-sm font-mono mt-1"}>
                      {selectedCoin.price_change_percentage_24h > 0 ? "+" : ""}{selectedCoin.price_change_percentage_24h?.toFixed(2)}% (24h)
                    </div>
                  </div>
                  <div className="flex bg-muted p-1 rounded-lg">
                     <button className={`px-2 py-1 text-xs rounded-md ${chartPeriod === "1" ? "bg-background shadow-sm" : ""}`} onClick={() => setChartPeriod("1")}>1D</button>
                     <button className={`px-2 py-1 text-xs rounded-md ${chartPeriod === "7" ? "bg-background shadow-sm" : ""}`} onClick={() => setChartPeriod("7")}>7D</button>
                     <button className={`px-2 py-1 text-xs rounded-md ${chartPeriod === "30" ? "bg-background shadow-sm" : ""}`} onClick={() => setChartPeriod("30")}>30D</button>
                     <button className={`px-2 py-1 text-xs rounded-md ${chartPeriod === "365" ? "bg-background shadow-sm" : ""}`} onClick={() => setChartPeriod("365")}>1Y</button>
                  </div>
                </div>

                <div className="h-48 pt-4 relative">
                  {loadingChart ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <YAxis domain={['auto', 'auto']} hide />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke={selectedCoin.price_change_percentage_24h >= 0 ? "#22c55e" : "#ef4444"} 
                          strokeWidth={2} 
                          dot={false} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mt-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <div className="text-muted-foreground mb-1 text-xs">Market Cap</div>
                    <div className="font-semibold font-mono">₹{selectedCoin.market_cap.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1 text-xs">Volume (24h)</div>
                    <div className="font-semibold font-mono">₹{selectedCoin.total_volume.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1 text-xs">High (24h)</div>
                    <div className="font-semibold font-mono">₹{selectedCoin.high_24h.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1 text-xs">Low (24h)</div>
                    <div className="font-semibold font-mono">₹{selectedCoin.low_24h.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
