import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Check, ShieldCheck } from "lucide-react";
import "./auth.css";

export default function Verify() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email") || "";

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
          <p>We've sent a verification link to your email address.</p>
          <div className="auth-features">
            <div><span className="auth-feature-check"><Check size={14} /></span> Secure link verification</div>
            <div><span className="auth-feature-check"><Check size={14} /></span> 256-bit encrypted sessions</div>
            <div><span className="auth-feature-check"><Check size={14} /></span> Your data stays private</div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card text-center">
          <h2>Check your email 📧</h2>
          <p className="auth-subtitle mb-6 text-slate-600">
            We sent a verification link to <br/>
            <strong>{maskedEmail}</strong>
          </p>

          <p className="text-sm text-slate-500 mb-8">
            Click the link in the email to automatically verify your account and get started. 
            Remember to check your spam folder if you don't see it!
          </p>

          <Link to="/login" className="auth-btn flex items-center justify-center">
             Return to login
          </Link>

          <div className="auth-switch mt-8">
             Wrong email? <Link to="/signup">Start over</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
