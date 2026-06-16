import React, { useState } from "react";
import { Lock, Mail, CheckCircle2, Send, AlertCircle } from "lucide-react";

export default function Investors() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    org: "",
    type: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", org: "", type: "", message: "" });
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in fade-in duration-500">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-start">
        <div>
          <div className="text-blue-600 font-bold uppercase tracking-wider text-sm mb-4">Get in Touch</div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Interested in<br />Partnering With Us?
          </h2>
          <p className="text-lg text-slate-600 mb-6 leading-relaxed">
            We welcome conversations with angels, family offices, VCs, and strategic partners who share our vision of making crypto accessible to everyone worldwide.
          </p>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Fill in the form and we'll respond within 48 hours. All conversations are strictly confidential.
          </p>
          
          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl mb-8 border border-slate-100">
            <Lock className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <span className="text-sm text-slate-600">Your details are kept private. We never share investor inquiries.</span>
          </div>
          
          <a href="mailto:partnership@coinscanner.tech" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors">
            <Mail className="w-5 h-5 mr-2" />
            partnership@coinscanner.tech
          </a>
        </div>

        <div>
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
            <h3 className="text-2xl font-bold mb-6">Contact Us</h3>

            {status === "success" ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center animate-in zoom-in-95">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <strong className="block text-lg text-green-900 mb-1">Message sent!</strong>
                <p className="text-green-700">We'll get back to you within 48 hours.</p>
                <button 
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-green-700 font-medium hover:text-green-800"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {status === "error" && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Please fill in all required fields.
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-slate-700">Your Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Name"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-slate-700">Email Address <span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    required 
                    placeholder="Email"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-slate-700">Organisation</label>
                  <input 
                    type="text" 
                    placeholder="e.g. XYZ Capital (optional)"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all"
                    value={formData.org}
                    onChange={(e) => setFormData({...formData, org: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-slate-700">Investor Type <span className="text-red-500">*</span></label>
                  <select 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all bg-white"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="" disabled>Select type</option>
                    <option value="Angel Investor">Angel Investor</option>
                    <option value="Venture Capital">Venture Capital</option>
                    <option value="Family Office">Family Office</option>
                    <option value="Strategic Partner">Strategic Partner</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-slate-700">Message <span className="text-red-500">*</span></label>
                  <textarea 
                    required 
                    rows={4} 
                    placeholder="Tell us about your interest, investment thesis, or any questions you have…"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all resize-y"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={status === "loading"}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                >
                  <Send className="w-5 h-5" /> {status === "loading" ? "Sending..." : "Send Inquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
