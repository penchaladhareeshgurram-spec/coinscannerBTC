import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Key, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    
    setError(null);
    setLoading(true);
    
    // Simulating API verification (replace with actual API call)
    setTimeout(() => {
      setLoading(false);
      setSuccess("Your password has been changed successfully.");
      setTimeout(() => navigate("/profile"), 2000);
    }, 1000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border rounded-2xl shadow-xl overflow-hidden p-8 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="text-center mb-8">
          <Link to="/profile" className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Profile
          </Link>
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Change Password</h1>
          <p className="text-sm text-muted-foreground mt-2">Enter your current password and choose a new one.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-start gap-3 mb-6 animate-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-start gap-3 mb-6 animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Current Password</label>
            <div className="relative">
              <input 
                type={showCurrent ? "text" : "password"} 
                required
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-xl border bg-background outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all font-medium text-sm"
              />
              <button 
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="mt-2 text-right">
              <Link to="/forgot-password" className="text-xs font-semibold text-blue-600 hover:text-blue-700">Forgot password?</Link>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">New Password</label>
            <div className="relative">
              <input 
                type={showNew ? "text" : "password"} 
                required
                placeholder="Min 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-xl border bg-background outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all font-medium text-sm"
              />
              <button 
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Password strength wrapper */}
            <div className="mt-2.5">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                <div className={`h-full flex-1 rounded-full ${newPassword.length > 0 ? "bg-red-400" : "bg-slate-200"}`} />
                <div className={`h-full flex-1 rounded-full ${newPassword.length >= 6 ? "bg-amber-400" : "bg-slate-200"}`} />
                <div className={`h-full flex-1 rounded-full ${newPassword.length >= 8 ? "bg-green-400" : "bg-slate-200"}`} />
                <div className={`h-full flex-1 rounded-full ${newPassword.length >= 10 ? "bg-emerald-500" : "bg-slate-200"}`} />
              </div>
              <div className="text-[10px] text-muted-foreground mt-1 text-right">
                {newPassword.length === 0 ? "Enter password" : newPassword.length < 6 ? "Weak" : newPassword.length < 8 ? "Fair" : "Strong"}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Confirm New Password</label>
            <div className="relative">
              <input 
                type={showConfirm ? "text" : "password"} 
                required
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-xl border bg-background outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all font-medium text-sm"
              />
              <button 
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3.5 rounded-xl mt-6 flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
          >
            <Key className="w-4 h-4" /> {loading ? "Saving..." : "Save New Password"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/profile" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
            Cancel
          </Link>
        </div>

      </div>
    </div>
  );
}
