import express from "express";
import path from "path";
import cors from "cors";
import axios from "axios";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";

// Import Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, setDoc, doc, getDoc, query, where, updateDoc, deleteDoc } from "firebase/firestore";

let db: any = null;
try {
  const firebaseConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf8'));
  const firebaseApp = initializeApp(firebaseConfig);
  db = getFirestore(firebaseApp);
  console.log("Firebase initialized successfully");
} catch (err) {
  console.error("Failed to load Firebase config", err);
}

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(cors());

const SECRET_KEY = process.env.SECRET_KEY || "development_secret_key";

// --- Caching layer ---
const CACHE: Record<string, { data: any; timestamp: number }> = {};
const TTL_60S = 60 * 1000;
const TTL_24H = 24 * 60 * 60 * 1000;
const TTL_5M = 5 * 60 * 1000;

async function fetchWithCache(key: string, url: string, ttl: number) {
  const now = Date.now();
  if (CACHE[key] && now - CACHE[key].timestamp < ttl) {
    return CACHE[key].data;
  }
  const result = await axios.get(url, { headers: { "Accept-Encoding": "gzip,deflate,compress" } });
  CACHE[key] = { data: result.data, timestamp: now };
  return result.data;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/coins/ticker", async (req, res) => {
  try {
    const data = await fetchWithCache("ticker", "https://api.coindcx.com/exchange/ticker", TTL_60S);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/coins/markets", async (req, res) => {
  // Free API requires rate limiting protection, so we heavily cache this.
  try {
    const currency = req.query.vs_currency || "inr";
    const data = await fetchWithCache(`markets_${currency}`, `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=50&sparkline=true`, TTL_24H);
    res.json(data);
  } catch (err: any) {
    console.error("Coingecko API failed, returning mock data", err.message);
    const mockCoins = [
      { id: "bitcoin", symbol: "btc", name: "Bitcoin", current_price: 5500000, price_change_percentage_24h: 2.5, image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png", total_volume: 12000000000, sparkline_in_7d: { price: [1,2,3,4,5] } },
      { id: "ethereum", symbol: "eth", name: "Ethereum", current_price: 300000, price_change_percentage_24h: 1.2, image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png", total_volume: 5000000000, sparkline_in_7d: { price: [1,2,3,4,5] } },
      { id: "solana", symbol: "sol", name: "Solana", current_price: 15000, price_change_percentage_24h: 5.7, image: "https://assets.coingecko.com/coins/images/4128/large/solana.png", total_volume: 2000000000, sparkline_in_7d: { price: [1,2,3,4,5] } },
      { id: "cardano", symbol: "ada", name: "Cardano", current_price: 50, price_change_percentage_24h: -1.5, image: "https://assets.coingecko.com/coins/images/975/large/cardano.png", total_volume: 500000000, sparkline_in_7d: { price: [1,2,3,4,5] } },
      { id: "polkadot", symbol: "dot", name: "Polkadot", current_price: 800, price_change_percentage_24h: 0.5, image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png", total_volume: 300000000, sparkline_in_7d: { price: [1,2,3,4,5] } }
    ];
    // Add artificial delay for realism
    setTimeout(() => res.json(mockCoins), 500);
  }
});

app.get("/api/coins/global", async (req, res) => {
  try {
    const data = await fetchWithCache("global", "https://api.coingecko.com/api/v3/global", TTL_5M);
    res.json(data);
  } catch (err: any) {
    console.error("Global API blocked", err.message);
    const mockGlobal = {
      data: {
        active_cryptocurrencies: 12000,
        markets: 850,
        total_market_cap: { inr: 250000000000000 },
        total_volume: { inr: 10000000000000 },
        market_cap_percentage: { btc: 52.4, eth: 16.5 }
      }
    };
    setTimeout(() => res.json(mockGlobal), 500);
  }
});

app.get("/api/coins/trending", async (req, res) => {
  try {
    const data = await fetchWithCache("trending", "https://api.coingecko.com/api/v3/search/trending", TTL_5M);
    res.json(data);
  } catch (err: any) {
    console.error("Trending API blocked", err.message);
    const mockTrending = {
      coins: [
        { item: { id: "bitcoin", name: "Bitcoin", symbol: "btc", market_cap_rank: 1, thumb: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png" } },
        { item: { id: "solana", name: "Solana", symbol: "sol", market_cap_rank: 5, thumb: "https://assets.coingecko.com/coins/images/4128/large/solana.png" } },
        { item: { id: "dogecoin", name: "Dogecoin", symbol: "doge", market_cap_rank: 10, thumb: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png" } }
      ]
    };
    setTimeout(() => res.json(mockTrending), 500);
  }
});

app.get("/api/coins/:id/market_chart", async (req, res) => {
  try {
    const id = req.params.id;
    const days = req.query.days || "7";
    const cur = req.query.vs_currency || "inr";
    // We only cache charts for 1 hour to prevent spam
    const data = await fetchWithCache(`chart_${id}_${days}_${cur}`, `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${cur}&days=${days}`, 60 * 60 * 1000);
    res.json(data);
  } catch (err: any) {
    console.error("Market chart API blocked", err.message);
    const mockChart = {
      prices: Array.from({length: 100}).map((_, i) => [Date.now() - (100 - i) * 3600000, 50000 + Math.random() * 5000]),
      market_caps: [],
      total_volumes: []
    };
    setTimeout(() => res.json(mockChart), 500);
  }
});

// Authentication Routes
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: "Missing fields" });

  const hash = bcrypt.hashSync(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 300 * 1000;

  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const newUserRef = doc(usersRef);
    await setDoc(newUserRef, {
      id: newUserRef.id,
      name,
      email,
      phone: phone || null,
      password_hash: hash,
      is_verified: 0,
      otp_code: otp,
      otp_expiry: expiry
    });

    console.log(`[DEV OTP] OTP for ${email}: ${otp}`);
    res.json({ message: "OTP sent", userId: newUserRef.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/verify", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const q = query(collection(db, "users"), where("email", "==", email));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return res.status(404).json({ error: "User not found" });

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    if (user.otp_code !== otp || Date.now() > user.otp_expiry) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    await updateDoc(userDoc.ref, {
      is_verified: 1,
      otp_code: null,
      otp_expiry: null
    });

    res.json({ message: "Verification successful" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const q = query(collection(db, "users"), where("email", "==", email));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return res.status(401).json({ error: "Invalid credentials" });

    const user = snapshot.docs[0].data();

    if (!bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.is_verified === 0) {
      return res.status(403).json({ error: "Please verify your account first" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/forgot-password", async (req, res) => {
  const { identifier } = req.body;
  try {
    const q = query(collection(db, "users"), where("email", "==", identifier));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return res.status(404).json({ error: "User not found" });

    const userDoc = snapshot.docs[0];
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await updateDoc(userDoc.ref, {
      reset_otp: otp,
      reset_expiry: Date.now() + 300 * 1000
    });

    console.log(`[DEV OTP] Password Reset OTP for ${identifier}: ${otp}`);
    res.json({ message: "OTP sent" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/verify-reset-otp", async (req, res) => {
  const { identifier, otp } = req.body;
  try {
    const q = query(collection(db, "users"), where("email", "==", identifier));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return res.status(404).json({ error: "User not found" });

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    if (user.reset_otp !== otp || Date.now() > user.reset_expiry) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // OTP is valid, client can proceed to reset password. We'll issue a temporary token.
    const resetToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "15m" });
    
    await updateDoc(userDoc.ref, {
      reset_otp: null,
      reset_expiry: null
    });
    
    res.json({ resetToken });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/reset-password", async (req, res) => {
  const { resetToken, new_password } = req.body;
  try {
    const decoded: any = jwt.verify(resetToken, SECRET_KEY);
    
    const userDocRef = doc(db, "users", decoded.id);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) return res.status(404).json({ error: "User not found" });

    const hash = bcrypt.hashSync(new_password, 10);
    await updateDoc(userDocRef, {
      password_hash: hash
    });
    
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ error: "Invalid or expired reset session" });
  }
});

// Authentication middleware
const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const defaultSecret = "development_secret_key";
    const decoded = jwt.verify(token, process.env.SECRET_KEY || defaultSecret) as { id: string; email: string };
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

app.get("/api/watchlist", authenticate, async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).user.id;
    const q = query(collection(db, "watchlists"), where("user_id", "==", userId));
    const snapshot = await getDocs(q);
    
    const userWatchlist = snapshot.docs.map(doc => doc.data().coin_id);
    res.json(userWatchlist);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/watchlist", authenticate, async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).user.id;
    const { coin_id } = req.body;
    if (!coin_id) return res.status(400).json({ error: "Missing coin_id" });
    
    // Check if already in watchlist
    const q = query(collection(db, "watchlists"), where("user_id", "==", userId), where("coin_id", "==", coin_id));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      const newRef = doc(collection(db, "watchlists"));
      await setDoc(newRef, { id: newRef.id, user_id: userId, coin_id });
    }
    res.json({ message: "Added to watchlist" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/watchlist/:coin_id", authenticate, async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).user.id;
    const coinId = req.params.coin_id;
    
    const q = query(collection(db, "watchlists"), where("user_id", "==", userId), where("coin_id", "==", coinId));
    const snapshot = await getDocs(q);
    
    for (const d of snapshot.docs) {
      await deleteDoc(d.ref);
    }
    
    res.json({ message: "Removed from watchlist" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/news", async (req, res) => {
  try {
    const MOCK_NEWS = [
      {
        title: "Bitcoin Surpasses $70,000 Key Resistance As ETF Inflows Surge",
        source_id: "CryptoBriefing",
        pubDate: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        description: "Bitcoin (BTC) broke above the $70,000 level fueled by record string of net inflows into spot Bitcoin exchange-traded funds...",
        image_url: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=500&h=300&fit=crop"
      },
      {
        title: "SEC Delays Decision on Ethereum ETFs Next Month",
        source_id: "CoinDesk",
        pubDate: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(),
        description: "The Securities and Exchange Commission has delayed its decision on the spot Ethereum ETFs, citing the need for more public comment time.",
        image_url: "https://images.unsplash.com/photo-1622737133809-d95047b9e673?w=500&h=300&fit=crop"
      },
      {
        title: "India Sets Guidelines For Crypto Taxation",
        source_id: "Economic Times",
        pubDate: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        description: "The finance ministry has reiterated the 30% flat tax rate on crypto transactions and clarified conditions for offsetting losses.",
        image_url: "https://images.unsplash.com/photo-1596489370889-ff80d0d57e84?w=500&h=300&fit=crop"
      }
    ];

    const apiKey = process.env.NEWS_API_KEY;
    if (apiKey) {
      try {
        const data = await fetchWithCache("news", `https://newsdata.io/api/1/news?apikey=${apiKey}&q=crypto&language=en`, TTL_5M);
        return res.json(data.results || MOCK_NEWS);
      } catch(e) {
        console.error("News API failed", e);
        return res.json(MOCK_NEWS);
      }
    } else {
      setTimeout(() => res.json(MOCK_NEWS), 500); // Send mock if no API key
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Vite middleware for development or Static files for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Only start the server automatically if we are not in a Vercel serverless environment
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  startServer();
}

export default app;
