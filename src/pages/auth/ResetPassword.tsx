import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Key, Eye, EyeOff, Save, CheckCircle2, AlertCircle } from "lucide-react";
import axios from "axios";
import "./auth.css";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const resetToken = sessionStorage.getItem("resetToken");

  useEffect(() => {
    if (!resetToken) navigate("/forgot-password");
  }, [resetToken, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await axios.post("/api/auth/reset-password", { resetToken, new_password: password });
      sessionStorage.removeItem("resetToken");
      navigate("/login?reset=true");
    } catch (err: any) {
      setError(err.response?.data?.error || "Reset failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

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
    <div className="auth-flow-page animate-in slide-in-from-right-8 duration-300">
      <div className="auth-flow-box">
        <div className="afb-header">
          <div className="afb-icon-wrap">
            <Key size={28} />
          </div>
          <div className="afb-title">Set New Password</div>
          <div className="afb-sub">Choose a strong password to keep your account secure.</div>
        </div>

        <div className="afb-body">
          <div className="afb-success-strip">
            <CheckCircle2 size={16} /> Identity verified successfully
          </div>

          {error && (
            <div className="auth-alert auth-alert-error">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="afb-field mb-4">
              <label className="afb-label">New Password</label>
              <div className="afb-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  className="afb-input"
                  placeholder="Min 8 characters"
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" className="auth-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="afb-strength-wrap">
                <div className="afb-strength-bar">
                  <div className="afb-strength-fill" style={{ width: `${strength}%`, backgroundColor: strength > 50 ? '#22c55e' : (strength > 25 ? '#eab308' : '#ef4444') }}></div>
                </div>
              </div>
            </div>

            <div className="afb-field mb-5">
              <label className="afb-label">Confirm New Password</label>
              <div className="afb-input-wrap">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="afb-input"
                  placeholder="Repeat new password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="button" className="auth-eye-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password && confirmPassword && password !== confirmPassword && (
                <div className="afb-hint text-red-500 mt-1">Passwords do not match</div>
              )}
            </div>

            <button type="submit" className="afb-btn-primary" disabled={loading || password !== confirmPassword}>
              <Save size={18} /> {loading ? "Saving..." : "Save New Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
