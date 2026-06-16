import { useEffect, useState } from "react";
import axios from "axios";
import { Coin } from "@/src/types";
import { Link, useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, UserCircle, Star, Shield, ArrowRight, Settings } from "lucide-react";
import { auth, db } from "@/src/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";

export default function Profile() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "watchlist" | "settings">("overview");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }
      
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        setUser({ id: currentUser.uid, email: currentUser.email, ...userDoc.data() });
        
        // Fetch watchlist from Firestore
        const q = query(collection(db, "watchlists"), where("user_id", "==", currentUser.uid));
        const snapshot = await getDocs(q);
        const watchListData = snapshot.docs.map(d => d.data().coin_id);
        setWatchlist(watchListData);

        // Fetch coins
        const coinsRes = await axios.get("/api/coins/markets?vs_currency=inr");
        setCoins(coinsRes.data);
      } catch (err: any) {
        console.error("Failed to load profile data", err);
      } finally {
        setLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("tab") === "watchlist") {
      setActiveTab("watchlist");
    }
  }, []);

  const handleRemove = async (coinId: string) => {
    try {
      if (!user) return;
      const q = query(collection(db, "watchlists"), where("user_id", "==", user.id), where("coin_id", "==", coinId));
      const snapshot = await getDocs(q);
      for (const d of snapshot.docs) {
        await deleteDoc(d.ref);
      }
      setWatchlist(prev => prev.filter(id => id !== coinId));
    } catch (err) {
      console.error("Failed to remove coin");
    }
  };

  const watchlistedCoins = coins.filter(c => watchlist.includes(c.id));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-16">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-center gap-6 p-8 bg-card rounded-2xl border shadow-sm">
        <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-4xl font-bold border-4 border-white shadow-md">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{user?.name || "User"}</h1>
          <p className="text-slate-500 mt-1 mb-3">{user?.email}</p>
          <div className="flex items-center justify-center md:justify-start gap-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-green-100 text-green-700">
               <div className="w-2 h-2 rounded-full bg-green-500"></div> Verified
            </span>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Member since 2026</span>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="border-b flex gap-6 overflow-x-auto no-scrollbar">
        <button 
          className={`pb-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          onClick={() => setActiveTab('overview')}
        >
          <UserCircle className="w-4 h-4" /> Profile
        </button>
        <button 
          className={`pb-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'watchlist' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          onClick={() => setActiveTab('watchlist')}
        >
          <Star className="w-4 h-4" /> Watchlist
          {watchlist.length > 0 && <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full">{watchlist.length}</span>}
        </button>
      </div>

      {/* TAB CONTENT: PROFILE */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b bg-slate-50/50 flex items-center gap-2 text-slate-800 font-bold">
              <UserCircle className="w-5 h-5 text-slate-400" /> Basic Info
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Full Name</label>
                <div className="font-medium text-slate-900">{user?.name}</div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Email Address</label>
                <div className="font-medium text-slate-900">{user?.email}</div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Account Status</label>
                <div className="font-medium text-green-600">Verified</div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Member Since</label>
                <div className="font-medium text-slate-900">May 12, 2026</div>
              </div>
            </div>
          </div>

          {/* Password & Security */}
          <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b bg-slate-50/50 flex items-center gap-2 text-slate-800 font-bold">
              <Shield className="w-5 h-5 text-slate-400" /> Password & Security
            </div>
            <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Login Password</h3>
                <p className="text-sm text-slate-500">Keep your account secure with a strong password</p>
              </div>
              <Link to="/change-password" className="inline-flex items-center justify-center whitespace-nowrap bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm">
                Change Password <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: WATCHLIST */}
      {activeTab === 'watchlist' && (
        <div className="space-y-6">
          <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b bg-slate-50/50 flex items-center justify-between">
              <span className="font-bold flex items-center gap-2 text-slate-800"><Star className="w-5 h-5 text-slate-400" /> Saved Coins</span>
              <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-bold">{watchlist.length}</span>
            </div>
            
            <div className="p-0">
              {loading ? (
                <div className="p-12 text-center text-muted-foreground animate-pulse">Loading watchlist...</div>
              ) : watchlistedCoins.length === 0 ? (
                <div className="p-16 flex flex-col items-center justify-center text-center">
                  <Star className="w-12 h-12 text-slate-200 mb-4" />
                  <h3 className="text-lg font-bold text-slate-700">No coins saved yet</h3>
                  <p className="text-slate-500 mt-1 mb-6">Browse coins and click the star icon to add them here.</p>
                  <Link to="/coins">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl">Browse Coins &rarr;</Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-b uppercase text-[10px] tracking-wider font-semibold text-slate-500">
                        <TableHead className="w-16">Rank</TableHead>
                        <TableHead>Coin</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">24h Change</TableHead>
                        <TableHead className="text-right w-24"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {watchlistedCoins.map((coin) => (
                        <TableRow key={coin.id} className="hover:bg-slate-50/50 cursor-pointer">
                          <TableCell className="font-mono text-slate-500">{coin.market_cap_rank || "—"}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full border border-slate-100" />
                              <div>
                                <div className="font-bold text-slate-900">{coin.name}</div>
                                <div className="text-xs font-semibold text-slate-500 uppercase">{coin.symbol}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono font-bold text-slate-900 tracking-tight">
                            ₹{coin.current_price.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold ${coin.price_change_percentage_24h >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                              {coin.price_change_percentage_24h > 0 ? "▲" : "▼"} {Math.abs(coin.price_change_percentage_24h || 0)?.toFixed(2)}%
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <button onClick={() => handleRemove(coin.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>

          {/* Saved Exchanges */}
          <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b bg-slate-50/50 flex items-center justify-between">
              <span className="font-bold flex items-center gap-2 text-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
                Saved Exchanges
              </span>
              <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-bold">0</span>
            </div>
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-slate-200 mb-4"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
              <h3 className="text-lg font-bold text-slate-700">No exchanges saved yet</h3>
              <p className="text-slate-500 mt-1 mb-6">Browse exchanges to compare and click the star icon to add them.</p>
              <Link to="/compare">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl">Browse Exchanges &rarr;</Button>
              </Link>
            </div>
          </div>

          {/* Appearance Card */}
          <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b bg-slate-50/50 flex items-center gap-2 text-slate-800 font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><circle cx="13.5" cy="6.5" r="2.5"/><path d="m10.3 3.6 2.4-2.4c.5-.5 1.3-.5 1.8 0l7 7c.5.5.5 1.3 0 1.8l-2.4 2.4"/><path d="m14 17-5.5 5.5c-1 1-2.9 1-3.9 0l-1-1c-1-1-1-2.9 0-3.9L9 12"/><path d="m14.5 16.5-6-6"/></svg>
              Appearance
            </div>
            <div className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Dark Mode</h3>
                <p className="text-sm text-slate-500">Easier on the eyes at night</p>
              </div>
              <div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300" />
                <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 cursor-pointer"></label>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
