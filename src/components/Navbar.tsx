import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Coins, Newspaper, ListCollapse, LogIn, LineChart, User, Info, LogOut, Bookmark, Scale, Home, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { auth, db } from "@/src/lib/firebase";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [currency, setCurrency] = useState("inr");
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Fetch user document to get extra info if needed, or simply use currentUser attributes
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        setUser({ id: currentUser.uid, email: currentUser.email, ...userDoc.data() });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const links = [
    { name: "Home", path: "/", icon: <Home className="w-4 h-4 mr-2" /> },
    { name: "Compare", path: "/compare", icon: <Scale className="w-4 h-4 mr-2" /> },
    { name: "Markets", path: "/coins", icon: <TrendingUp className="w-4 h-4 mr-2" /> },
    { name: "News", path: "/news", icon: <Newspaper className="w-4 h-4 mr-2" /> },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 w-full bg-background border-b z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 text-xl font-bold tracking-tight">
              <img src="https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=40&h=40&fit=crop" alt="CoinScanner" className="w-8 h-8 rounded-lg" />
              <div className="hidden sm:flex flex-col">
                <span className="text-base font-extrabold leading-none tracking-wide text-foreground">COIN SCANNER</span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Opportunity scanner</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "hover:text-primary transition-colors flex items-center text-sm font-semibold",
                  location.pathname === link.path ? "text-primary border-b-2 border-primary py-5 -mb-[2px]" : "text-muted-foreground py-5 -mb-[2px]"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex bg-muted p-1 rounded-lg">
              <button
                onClick={() => setCurrency("inr")}
                className={cn("px-3 py-1 text-xs font-bold rounded-md transition-all", currency === "inr" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                ₹ INR
              </button>
              <button
                onClick={() => setCurrency("usd")}
                className={cn("px-3 py-1 text-xs font-bold rounded-md transition-all", currency === "usd" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                $ USD
              </button>
            </div>

            {user ? (
              <div className="relative hidden md:block" ref={accountRef}>
                <button 
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center border-2 border-transparent hover:border-blue-200 transition-all"
                >
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </button>
                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-card border rounded-xl shadow-lg border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 border-b bg-muted/30">
                      <p className="font-semibold text-sm truncate">{user?.name || 'User'}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Services</div>
                      <Link to="/coins" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md" onClick={() => setAccountOpen(false)}>
                        <TrendingUp className="w-4 h-4 text-blue-500" /> Markets
                      </Link>
                      <Link to="/compare" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md" onClick={() => setAccountOpen(false)}>
                        <Scale className="w-4 h-4 text-blue-500" /> Compare
                      </Link>
                    </div>
                    <div className="p-2 border-t">
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</div>
                      <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md" onClick={() => setAccountOpen(false)}>
                        <User className="w-4 h-4 text-blue-500" /> My Profile
                      </Link>
                      <Link to="/profile?tab=watchlist" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md" onClick={() => setAccountOpen(false)}>
                        <Bookmark className="w-4 h-4 text-blue-500" /> Watchlist
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 text-red-600 rounded-md">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="font-semibold">Log in</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Tab Bar */}
      <div className="md:hidden fixed bottom-0 w-full bg-background border-t z-50 pb-safe">
        <div className="flex justify-around py-2 px-1">
          {links.map((link) => (
             <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex flex-col items-center flex-1 text-[10px] font-semibold py-1 rounded-lg transition-colors",
                location.pathname === link.path ? "text-blue-600 bg-blue-50/50" : "text-muted-foreground hover:bg-muted/50"
              )}
            >
              {link.icon && <div className="mb-1">{link.icon}</div>}
              <span>{link.name}</span>
            </Link>
          ))}
          {user ? (
            <Link to="/profile" className={cn("flex flex-col items-center flex-1 text-[10px] font-semibold py-1 rounded-lg transition-colors", location.pathname === "/profile" ? "text-blue-600 bg-blue-50/50" : "text-muted-foreground hover:bg-muted/50")}>
              <div className="mb-1 relative">
                <User className="w-5 h-5 mx-auto" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-background"></span>
              </div>
              <span>Profile</span>
            </Link>
          ) : (
            <Link to="/login" className={cn("flex flex-col items-center flex-1 text-[10px] font-semibold py-1 rounded-lg transition-colors", location.pathname === "/login" || location.pathname === "/signup" ? "text-blue-600 bg-blue-50/50" : "text-muted-foreground hover:bg-muted/50")}>
              <div className="mb-1"><User className="w-5 h-5 mx-auto" /></div>
              <span>Log in</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
