import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MailOpen, Send, AlertCircle } from "lucide-react";
import axios from "axios";
import "./auth.css";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;

    setLoading(true);
    setError("");
    try {
      await axios.post("/api/auth/forgot-password", { identifier });
      navigate(`/verify-reset?identifier=${encodeURIComponent(identifier)}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Account not found.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-flow-page animate-in zoom-in-95 duration-300">
      <div className="auth-flow-box">
        <div className="afb-header">
          <Link to="/login" className="afb-back">
            <ArrowLeft size={16} /> Back to Login
          </Link>
          <div className="afb-icon-wrap">
            <MailOpen size={28} />
          </div>
          <div className="afb-title">Forgot Password?</div>
          <div className="afb-sub">Enter your registered email or phone number. We'll send you a 6-digit OTP to verify your identity.</div>
        </div>

        <div className="afb-body">
          {error && (
            <div className="auth-alert auth-alert-error">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="afb-field">
              <label className="afb-label">Email or Phone Number</label>
              <div className="afb-input-wrap">
                <input
                  type="text"
                  className="afb-input"
                  placeholder="Enter your email or phone number"
                  autoFocus
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="afb-btn-primary" disabled={loading}>
              <Send size={18} /> {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>

          <Link to="/login" className="afb-btn-ghost mt-2">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
