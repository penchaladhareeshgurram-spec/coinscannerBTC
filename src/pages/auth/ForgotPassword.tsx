import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MailOpen, Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { auth, db } from "../../lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import "./auth.css";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;

    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      let emailToReset = identifier;
      
      if (/^[\d+\-\s]+$/.test(identifier)) {
        const q = query(collection(db, "users"), where("phone", "==", identifier));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            throw new Error("No user found with this mobile number.");
        }
        emailToReset = querySnapshot.docs[0].data().email;
      }

      await sendPasswordResetEmail(auth, emailToReset);
      setSuccess(true);
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setError("Account not found.");
      } else {
        setError(err.message || "Failed to send reset email.");
      }
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
          <div className="afb-sub">Enter your registered email or phone number. We'll send you a password reset link.</div>
        </div>

        <div className="afb-body">
          {error && (
            <div className="auth-alert auth-alert-error">
              <AlertCircle size={18} /> {error}
            </div>
          )}
          {success && (
            <div className="auth-alert auth-alert-success">
              <CheckCircle2 size={18} /> Password reset link sent! Please check your email.
            </div>
          )}

          {!success && (
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
                <Send size={18} /> {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}

          <Link to="/login" className="afb-btn-ghost mt-2">
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
