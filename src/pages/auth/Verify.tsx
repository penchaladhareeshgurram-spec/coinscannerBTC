import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Check, ShieldCheck, AlertCircle } from "lucide-react";
import axios from "axios";
import "./auth.css";

export default function Verify() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (!email) navigate("/signup");
    
    // Countdown
    const int = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(int);
  }, [email, navigate]);

  const handleChange = (index: number, val: string) => {
    if (isNaN(Number(val))) return;
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6).split("");
    if (pasted.some(char => isNaN(Number(char)))) return;
    
    const newOtp = [...otp];
    pasted.forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    const focusIndex = Math.min(pasted.length, 5);
    inputsRef.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) return;

    setLoading(true);
    setError("");
    try {
      await axios.post("/api/auth/verify", { email, otp: fullOtp });
      navigate("/login?verified=true");
    } catch (err: any) {
      setError(err.response?.data?.error || "Verification failed");
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const maskedEmail = email ? email.replace(/(.{2})(.*)(?=@)/, (match, a, b) => a + '*'.repeat(b.length)) : "";

  return (
    <div className="auth-container animate-in slide-in-from-right-4 duration-300">
      <div className="auth-left">
        <Link to="/" className="auth-logo">
          <img src="https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=80&h=80&fit=crop" alt="Logo" style={{ objectFit: 'cover' }} />
          <div className="auth-logo-text">
            <span className="auth-logo-name">COIN SCANNER</span>
            <span className="auth-logo-tagline">Real-time crypto opportunity scanner</span>
          </div>
        </Link>
        <div className="auth-left-content">
          <h1>One last step to <span>secure your account</span></h1>
          <p>We sent a 6-digit code to verify your identity. It expires in 5 minutes.</p>
          <div className="auth-features">
            <div><span className="auth-feature-check"><Check size={14} /></span> Secure OTP verification</div>
            <div><span className="auth-feature-check"><Check size={14} /></span> 256-bit encrypted sessions</div>
            <div><span className="auth-feature-check"><Check size={14} /></span> Your data stays private</div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <h2>Verify your account 🔐</h2>
          <p className="auth-subtitle">
            Enter the 6-digit OTP sent to <strong>{maskedEmail}</strong>
          </p>

          {error && (
            <div className="auth-alert auth-alert-error">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="otp-boxes-wrap">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  className="otp-box"
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  ref={(el) => (inputsRef.current[i] = el)}
                />
              ))}
            </div>

            <div className="otp-timer-row">
              <span>Resend in <strong>{timer}</strong>s</span>
              <button 
                type="button" 
                className="otp-resend-link" 
                disabled={timer > 0} 
                style={{ opacity: timer > 0 ? 0.4 : 1 }}
                onClick={() => { setTimer(60); alert("Dev note: Check backend logs for OTP"); }}
              >
                Resend OTP
              </button>
            </div>

            <button type="submit" className="auth-btn" disabled={loading || otp.join("").length < 6}>
              <ShieldCheck size={18} /> Verify Account
            </button>
          </form>

          <div className="auth-switch">
             Wrong email? <Link to="/signup">Start over</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
