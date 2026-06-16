import express from "express";
import path from "path";
import cors from "cors";
import axios from "axios";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// Initialize In-Memory Data Structures (Replaces SQLite)
let users: any[] = [];
let watchlists: any[] = [];
let nextUserId = 1;

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
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/coins/global", async (req, res) => {
  try {
    const data = await fetchWithCache("global", "https://api.coingecko.com/api/v3/global", TTL_5M);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/coins/trending", async (req, res) => {
  try {
    const data = await fetchWithCache("trending", "https://api.coingecko.com/api/v3/search/trending", TTL_5M);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

// Authentication Routes
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: "Missing fields" });

  const hash = bcrypt.hashSync(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 300 * 1000;

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: "Email already exists" });
  }

  const newUser = {
    id: nextUserId++,
    name,
    email,
    phone,
    password_hash: hash,
    is_verified: 0,
    otp_code: otp,
    otp_expiry: expiry
  };
  users.push(newUser);

  console.log(`[DEV OTP] OTP for ${email}: ${otp}`);
  res.json({ message: "OTP sent", userId: newUser.id });
});

app.post("/api/auth/verify", (req, res) => {
  const { email, otp } = req.body;
  const user = users.find(u => u.email === email || u.phone === email);
  if (!user) return res.status(404).json({ error: "User not found" });

  if (user.otp_code !== otp || Date.now() > user.otp_expiry) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  user.is_verified = 1;
  user.otp_code = null;
  user.otp_expiry = null;

  res.json({ message: "Verification successful" });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email || u.phone === email);
  
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  if (!bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  if (user.is_verified === 0) {
    return res.status(403).json({ error: "Please verify your account first" });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

app.post("/api/auth/forgot-password", (req, res) => {
  const { identifier } = req.body;
  const user = users.find(u => u.email === identifier || u.phone === identifier);
  if (!user) return res.status(404).json({ error: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.reset_otp = otp;
  user.reset_expiry = Date.now() + 300 * 1000;

  console.log(`[DEV OTP] Password Reset OTP for ${identifier}: ${otp}`);
  res.json({ message: "OTP sent" });
});

app.post("/api/auth/verify-reset-otp", (req, res) => {
  const { identifier, otp } = req.body;
  const user = users.find(u => u.email === identifier || u.phone === identifier);
  if (!user) return res.status(404).json({ error: "User not found" });

  if (user.reset_otp !== otp || Date.now() > user.reset_expiry) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  // OTP is valid, client can proceed to reset password. We'll issue a temporary token.
  const resetToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "15m" });
  user.reset_otp = null;
  user.reset_expiry = null;
  
  res.json({ resetToken });
});

app.post("/api/auth/reset-password", (req, res) => {
  const { resetToken, new_password } = req.body;
  try {
    const decoded: any = jwt.verify(resetToken, SECRET_KEY);
    const user = users.find(u => u.id === decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const hash = bcrypt.hashSync(new_password, 10);
    user.password_hash = hash;
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
    const decoded = jwt.verify(token, process.env.SECRET_KEY || defaultSecret) as { id: number; email: string };
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

app.get("/api/watchlist", authenticate, (req: express.Request, res: express.Response) => {
  const userId = (req as any).user.id;
  const userWatchlist = watchlists.filter(w => w.user_id === userId).map(w => w.coin_id);
  res.json(userWatchlist);
});

app.post("/api/watchlist", authenticate, (req: express.Request, res: express.Response) => {
  const userId = (req as any).user.id;
  const { coin_id } = req.body;
  if (!coin_id) return res.status(400).json({ error: "Missing coin_id" });
  
  // Don't add duplicate
  if (!watchlists.find(w => w.user_id === userId && w.coin_id === coin_id)) {
    watchlists.push({ id: watchlists.length + 1, user_id: userId, coin_id });
  }
  res.json({ message: "Added to watchlist" });
});

app.delete("/api/watchlist/:coin_id", authenticate, (req: express.Request, res: express.Response) => {
  const userId = (req as any).user.id;
  const coinId = req.params.coin_id;
  watchlists = watchlists.filter(w => !(w.user_id === userId && w.coin_id === coinId));
  res.json({ message: "Removed from watchlist" });
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
      const data = await fetchWithCache("news", `https://newsdata.io/api/1/news?apikey=${apiKey}&q=crypto&language=en`, TTL_5M);
      return res.json(data.results || MOCK_NEWS);
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
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
