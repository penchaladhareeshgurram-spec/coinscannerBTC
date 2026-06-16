import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Smartphone, ShieldCheck, AlertCircle } from "lucide-react";
import axios from "axios";
import "./auth.css";

export default function VerifyResetOtp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const identifier = searchParams.get("identifier") || "";

  useEffect(() => {
    if (!identifier) navigate("/forgot-password");
    
    // Countdown
    const int = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(int);
  }, [identifier, navigate]);

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
      const res = await axios.post("/api/auth/verify-reset-otp", { identifier, otp: fullOtp });
      sessionStorage.setItem("resetToken", res.data.resetToken);
      navigate("/reset-password");
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid OTP");
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const masked = identifier ? identifier.replace(/(.{2})(.*)(?=@)/, (match, a, b) => a + '*'.repeat(b.length)) : "";

  return (
    <div className="auth-flow-page animate-in slide-in-from-right-8 duration-300">
      <div className="auth-flow-box">
        <div className="afb-header">
          <Link to="/forgot-password" className="afb-back">
            <ArrowLeft size={16} /> Back
          </Link>
          <div className="afb-icon-wrap">
            <Smartphone size={28} />
          </div>
          <div className="afb-title">Enter OTP</div>
          <div className="afb-sub">A 6-digit code was sent to your registered contact. It's valid for 5 minutes.</div>
        </div>

        <div className="afb-body">
          {error && (
            <div className="auth-alert auth-alert-error">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <div className="otp-sent-to">
             Sent to <strong>{masked || identifier}</strong>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="otp-wrap">
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

            <div className="otp-timer">
              <span>Resend in <strong className="text-primary">{timer}</strong>s</span>
              <button 
                type="button" 
                className="otp-resend-btn" 
                disabled={timer > 0}
                style={{ opacity: timer > 0 ? 0.4 : 1 }}
                onClick={() => { setTimer(60); alert("Dev note: Check backend logs for OTP"); }}
              >
                Resend OTP
              </button>
            </div>

            <button type="submit" className="afb-btn-primary mt-4" disabled={loading || otp.join("").length < 6}>
              <ShieldCheck size={18} /> Verify OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
