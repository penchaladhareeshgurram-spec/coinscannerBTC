import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AlertCircle, CheckCircle2, Lock, Mail, Eye, EyeOff, LogIn, Check } from "lucide-react";
import { auth, db } from "../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import "./auth.css";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const resetSuccess = searchParams.get('reset') === 'true';
  const verifySuccess = searchParams.get('verified') === 'true';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let emailToLogin = identifier;
      
      // If looks like a phone number, resolve it to an email in Firestore first
      if (/^[\d+\-\s]+$/.test(identifier)) {
        const q = query(collection(db, "users"), where("phone", "==", identifier));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            throw new Error("No user found with this mobile number.");
        }
        emailToLogin = querySnapshot.docs[0].data().email;
      }

      await signInWithEmailAndPassword(auth, emailToLogin, password);
      navigate("/");
    } catch (err: any) {
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
         setError("Invalid credentials");
      } else {
         setError(err.message || "Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-in fade-in duration-500">
      <div className="auth-left">
        <Link to="/" className="auth-logo">
          <img src="https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=80&h=80&fit=crop" alt="Logo" style={{ objectFit: 'cover' }} />
          <div className="auth-logo-text">
            <span className="auth-logo-name">COIN SCANNER</span>
            <span className="auth-logo-tagline">Real-time crypto opportunity scanner</span>
          </div>
        </Link>
        <div className="auth-left-content">
          <h1>Your <span>crypto intelligence</span> platform</h1>
          <p>Track live prices, compare exchanges and make smarter investment and trading decisions — all in one place.</p>
          <div className="auth-features">
            <div><span className="auth-feature-check"><Check size={14} /></span> Real-time INR prices from CoinDCX</div>
            <div><span className="auth-feature-check"><Check size={14} /></span> Compare 14+ exchanges worldwide</div>
            <div><span className="auth-feature-check"><Check size={14} /></span> Save coins & exchanges to watchlist</div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <h2>Welcome back 👋</h2>
          <p className="auth-subtitle">Log in to access your watchlist and dashboard</p>

          {error && (
            <div className="auth-alert auth-alert-error">
              <AlertCircle size={18} /> {error}
            </div>
          )}
          {resetSuccess && (
            <div className="auth-alert auth-alert-success">
              <CheckCircle2 size={18} /> Password reset successfully. Please log in.
            </div>
          )}
          {verifySuccess && (
            <div className="auth-alert auth-alert-success">
              <CheckCircle2 size={18} /> Account verified! You can now log in.
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email or Phone Number</label>
              <div className="form-input-wrap">
                <Mail className="form-input-icon" size={18} />
                <input
                  type="text"
                  placeholder="Email or Phone"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label">Password</label>
                <Link to="/forgot-password" className="form-forgot-link">Forgot password?</Link>
              </div>
              <div className="form-input-wrap">
                <Lock className="form-input-icon" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="auth-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-check-row">
              <label className="form-check">
                <input type="checkbox" />
                <span className="form-check-label">Keep me logged in for 30 days</span>
              </label>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              <LogIn size={18} /> {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account? <Link to="/signup">Sign up free</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
