import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock, Mail, Smartphone, Eye, EyeOff, UserPlus, Check, AlertCircle } from "lucide-react";
import axios from "axios";
import "./auth.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await axios.post("/api/auth/signup", { name, email, phone, password });
      navigate(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // Basic strength checker
  const getStrengthPercent = () => {
    if (!password) return 0;
    let rank = 0;
    if (password.length > 5) rank += 25;
    if (password.length > 7) rank += 25;
    if (/[A-Z]/.test(password)) rank += 25;
    if (/[0-9]/.test(password)) rank += 25;
    return rank;
  };

  const strength = getStrengthPercent();

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
          <h1>Start your <span>smart investing</span> journey today</h1>
          <p>Join thousands of investors using CoinScanner to track, compare, and trade crypto with confidence.</p>
          <div className="auth-features">
            <div><span className="auth-feature-check"><Check size={14} /></span> Compare exchanges instantly</div>
            <div><span className="auth-feature-check"><Check size={14} /></span> Track real-time prices in INR</div>
            <div><span className="auth-feature-check"><Check size={14} /></span> Save coins & exchanges to watchlist</div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <h2>Create account</h2>
          <p className="auth-subtitle">Join CoinScanner today — it's free forever</p>

          {error && (
            <div className="auth-alert auth-alert-error">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="form-input-wrap">
                <User className="form-input-icon" size={18} />
                <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="form-input-wrap">
                <Mail className="form-input-icon" size={18} />
                <input type="email" placeholder="jack@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <div className="form-input-wrap">
                <Smartphone className="form-input-icon" size={18} />
                <input type="tel" placeholder="Mobile Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input-wrap">
                <Lock className="form-input-icon" size={18} />
                <input type={showPassword ? "text" : "password"} placeholder="Min 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" className="auth-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="auth-strength-wrap">
                <div className="auth-strength-bar">
                  <div className="auth-strength-fill" style={{ width: `${strength}%`, backgroundColor: strength > 50 ? '#22c55e' : (strength > 25 ? '#eab308' : '#ef4444') }}></div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="form-input-wrap">
                <Lock className="form-input-icon" size={18} />
                <input type={showConfirmPassword ? "text" : "password"} placeholder="Repeat password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                <button type="button" className="auth-eye-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              <UserPlus size={18} /> {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
