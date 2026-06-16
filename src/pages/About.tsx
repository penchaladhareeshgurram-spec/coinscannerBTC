import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  Crosshair,
  TriangleAlert,
  BookOpen,
  EyeOff,
  Lock,
  IndianRupee,
  HelpCircle,
  CheckCircle2,
  Wallet,
  LayoutList,
  Lightbulb,
  Percent,
  Sliders,
  Check,
  X,
  Mail,
  Instagram
} from "lucide-react";
import "./about.css";

export default function About() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="lp-section-wrapper animate-in fade-in duration-500">
      {/* HERO SECTION */}
      <section className="lp-hero">
        <div className="lp-hero-bg">
          <div className="lp-orb1 lp-hero-orb"></div>
          <div className="lp-orb2 lp-hero-orb"></div>
          <div className="lp-grid-pattern"></div>
        </div>
        <div className="lp-container">
          <div className="lp-hero-inner">
            <div className="lp-hero-badge">
              <span className="lp-badge-dot"></span> Now in Beta — Join the Waitlist
            </div>
            <h1 className="lp-hero-title">
              Your Gateway to<br />
              <span className="lp-hero-accent">Smarter Crypto</span><br />
              Invest & Trade
            </h1>
            <p className="lp-hero-sub">
              Compare crypto exchanges, find the best fees, and start investing with ease - all in one place. Built for the world's next generation of investors.
            </p>
            <div className="lp-hero-ctas">
              <Link to="/signup" className="lp-btn-primary">
                Join the Waitlist <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link to="/compare" className="lp-btn-ghost">
                Compare Exchanges
              </Link>
            </div>
            <div className="lp-hero-stats">
              <div className="lp-stat">
                <span className="lp-stat-num">Start small</span>
                <span className="lp-stat-label">Invest at your pace</span>
              </div>
              <div className="lp-stat-div"></div>
              <div className="lp-stat">
                <span className="lp-stat-num">Free</span>
                <span className="lp-stat-label">Always free to use</span>
              </div>
              <div className="lp-stat-div"></div>
              <div className="lp-stat">
                <span className="lp-stat-num">0%</span>
                <span className="lp-stat-label">No hidden fees</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IS COIN SCANNER */}
      <section className="lp-section lp-about-section">
        <div className="lp-container">
          <div className="text-center mb-12">
            <div className="lp-section-tag">About Us</div>
            <h2 className="lp-section-title">What is Coin Scanner?</h2>
            <p className="lp-section-lead">
              Coin Scanner (C.S) is a next-generation crypto exchange scanner built to make investing and trading <strong>simple, smart, and accessible.</strong> Whether you're just starting out or working with a small budget, C.S is here to guide you.
            </p>
          </div>
          <div className="lp-feature-grid">
            <div className="lp-feature-card" style={{ "--delay": "0s" } as any}>
              <div className="lp-feature-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
                <Wallet size={24} />
              </div>
              <h3>Find the right exchange</h3>
              <p>Start your journey with exchanges that match your budget</p>
            </div>
            <div className="lp-feature-card" style={{ "--delay": "0.08s" } as any}>
              <div className="lp-feature-icon" style={{ background: "#f0fdf4", color: "#16a34a" }}>
                <LayoutList size={24} />
              </div>
              <h3>Compare in one place</h3>
              <p>Fees, features, security and offerings across multiple platforms — side by side.</p>
            </div>
            <div className="lp-feature-card" style={{ "--delay": "0.16s" } as any}>
              <div className="lp-feature-icon" style={{ background: "#fffbeb", color: "#d97706" }}>
                <BookOpen size={24} />
              </div>
              <h3>Learn crypto the easy way</h3>
              <p>Beginner-friendly explanations and guides — like someone explaining it to a 5-year-old.</p>
            </div>
            <div className="lp-feature-card" style={{ "--delay": "0.24s" } as any}>
              <div className="lp-feature-icon" style={{ background: "#fdf4ff", color: "#9333ea" }}>
                <Shield size={24} />
              </div>
              <h3>Unbiased recommendations</h3>
              <p>Balanced, no hidden agenda. Just data-driven insights you can trust.</p>
            </div>
            <div className="lp-feature-card" style={{ "--delay": "0.32s" } as any}>
              <div className="lp-feature-icon" style={{ background: "#fff1f2", color: "#e11d48" }}>
                <Percent size={24} />
              </div>
              <h3>Save money while trading</h3>
              <p>Get cashback on brokerage and commissions when you trade via partner exchanges.</p>
            </div>
            <div className="lp-feature-card" style={{ "--delay": "0.4s" } as any}>
              <div className="lp-feature-icon" style={{ background: "#ecfdf5", color: "#059669" }}>
                <Sliders size={24} />
              </div>
              <h3>Deposit mode filter</h3>
              <p>Filter by INR, USD, or P2P — choose the most convenient funding method for you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="lp-section lp-vm-section">
        <div className="lp-container">
          <div className="lp-vm-grid">
            <div className="lp-vm-card lp-vision">
              <div className="lp-vm-icon"><Eye size={28} /></div>
              <h3>Our Vision</h3>
              <p>To become the world's most trusted crypto exchange scanner that makes investing <strong>transparent, safe, and rewarding</strong> for everyone.</p>
            </div>
            <div className="lp-vm-card lp-mission">
              <div className="lp-vm-icon"><Crosshair size={28} /></div>
              <h3>Our Mission</h3>
              <p>To provide a real-time, unbiased crypto exchange comparison platform that helps users trade with <strong>clarity, confidence, and lower costs.</strong></p>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM & SOLUTION */}
      <section className="lp-section lp-ps-section">
        <div className="lp-container">
          <div className="text-center mb-12">
            <div className="lp-section-tag">Why We Exist</div>
            <h2 className="lp-section-title">The Problem We Solve</h2>
          </div>
          <div className="lp-ps-grid">
            <div className="lp-ps-col">
              <div className="lp-ps-header problem-header">
                <TriangleAlert size={18} /> The Problems
              </div>
              <div className="lp-problem-list">
                <div className="lp-problem-item">
                  <div className="lp-problem-icon"><BookOpen size={18} /></div>
                  <div>
                    <strong>Lack of financial literacy</strong>
                    <p>Beginners struggle with overwhelming crypto information and jargon.</p>
                  </div>
                </div>
                <div className="lp-problem-item">
                  <div className="lp-problem-icon"><EyeOff size={18} /></div>
                  <div>
                    <strong>Confusing comparisons</strong>
                    <p>Hidden fees and complex structures make choosing an exchange difficult.</p>
                  </div>
                </div>
                <div className="lp-problem-item">
                  <div className="lp-problem-icon"><Lock size={18} /></div>
                  <div>
                    <strong>Limited accessibility</strong>
                    <p>Most platforms cater to big traders, leaving small investors behind.</p>
                  </div>
                </div>
                <div className="lp-problem-item">
                  <div className="lp-problem-icon"><IndianRupee size={18} /></div>
                  <div>
                    <strong>No benefit sharing</strong>
                    <p>Small investors pay full fees without discounts or cashback rewards.</p>
                  </div>
                </div>
                <div className="lp-problem-item">
                  <div className="lp-problem-icon"><HelpCircle size={18} /></div>
                  <div>
                    <strong>Unclear deposit options</strong>
                    <p>Users don't know which exchanges accept INR vs USD vs P2P — leading to extra fees.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lp-ps-col">
              <div className="lp-ps-header solution-header">
                <CheckCircle2 size={18} /> The C.S Solution
              </div>
              <div className="lp-solution-list">
                <div className="lp-solution-item">
                  <div className="lp-solution-icon"><Wallet size={18} /></div>
                  <div>
                    <strong>Budget-based discovery</strong>
                    <p>start small and discover options that fit your budget</p>
                  </div>
                </div>
                <div className="lp-solution-item">
                  <div className="lp-solution-icon"><LayoutList size={18} /></div>
                  <div>
                    <strong>Comprehensive comparison</strong>
                    <p>Fees, security, compliance and more — all in one transparent view.</p>
                  </div>
                </div>
                <div className="lp-solution-item">
                  <div className="lp-solution-icon"><Lightbulb size={18} /></div>
                  <div>
                    <strong>Educational layer</strong>
                    <p>We break down crypto in plain, everyday language. No jargon, ever.</p>
                  </div>
                </div>
                <div className="lp-solution-item">
                  <div className="lp-solution-icon"><Percent size={18} /></div>
                  <div>
                    <strong>Cashback rewards</strong>
                    <p>Trade via partner exchanges and get a share of the commission back in your pocket.</p>
                  </div>
                </div>
                <div className="lp-solution-item">
                  <div className="lp-solution-icon"><Sliders size={18} /></div>
                  <div>
                    <strong>Deposit mode filter</strong>
                    <p>Instantly filter exchanges by INR, USD or P2P — choose what's right for you.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="lp-section lp-why-section">
        <div className="lp-container">
          <div className="text-center mb-12">
            <div className="lp-section-tag">Why Coin Scanner</div>
            <h2 className="lp-section-title">Built Different, By Design</h2>
            <p className="lp-section-lead">Unlike INDmoney or other platforms, Coin Scanner is <strong>budget-first, fair, and beginner-focused</strong> — built to empower investors worldwide, not overwhelm them.</p>
          </div>
          
          <div className="lp-compare-table">
            <div className="lp-compare-header">
              <div></div>
              <div className="lp-compare-col lp-compare-others">Others</div>
              <div className="lp-compare-col lp-compare-cs">Coin Scanner</div>
            </div>
            
            <div className="lp-compare-row">
              <span>Minimum investment</span>
              <span className="lp-compare-bad"><X size={16} className="inline mr-1" /> High minimums</span>
              <span className="lp-compare-good"><Check size={16} className="inline mr-1" /> Start with small amounts</span>
            </div>
            <div className="lp-compare-row">
              <span>Fee transparency</span>
              <span className="lp-compare-bad"><X size={16} className="inline mr-1" /> Hidden charges</span>
              <span className="lp-compare-good"><Check size={16} className="inline mr-1" /> Fully transparent</span>
            </div>
            <div className="lp-compare-row">
              <span>Beginner friendly</span>
              <span className="lp-compare-bad"><X size={16} className="inline mr-1" /> Complex UI</span>
              <span className="lp-compare-good"><Check size={16} className="inline mr-1" /> Plain language</span>
            </div>
            <div className="lp-compare-row">
              <span>Cashback rewards</span>
              <span className="lp-compare-bad"><X size={16} className="inline mr-1" /> None</span>
              <span className="lp-compare-good"><Check size={16} className="inline mr-1" /> Yes, always</span>
            </div>
            <div className="lp-compare-row">
              <span>Deposit filter (INR/USD/P2P)</span>
              <span className="lp-compare-bad"><X size={16} className="inline mr-1" /> Not available</span>
              <span className="lp-compare-good"><Check size={16} className="inline mr-1" /> Built-in filter</span>
            </div>
            <div className="lp-compare-row">
              <span>Hidden promotions</span>
              <span className="lp-compare-bad"><X size={16} className="inline mr-1" /> Paid rankings</span>
              <span className="lp-compare-good"><Check size={16} className="inline mr-1" /> Zero agenda</span>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="lp-section lp-team-section">
        <div className="lp-container">
          <div className="text-center mb-12">
            <div className="lp-section-tag">The People</div>
            <h2 className="lp-section-title">Meet the Visionaries</h2>
            <p className="lp-section-lead">A team of passionate builders, traders, and operators on a mission to make crypto fair for everyone.</p>
          </div>
          
          <div className="lp-team-grid">
            <div className="lp-team-card">
              <div className="lp-team-avatar" style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)" }}>
                <span>DP</span>
              </div>
              <h3>Dwaraka Prasad</h3>
              <div className="lp-team-role">Founder & Financial Head</div>
              <p>Stock broker with 5+ years of experience in financial markets. Drives the vision and financial strategy of Coin Scanner.</p>
              <div className="lp-team-tags">
                <span>Founder</span><span>Finance</span><span>Strategy</span>
              </div>
            </div>
            
            <div className="lp-team-card">
              <div className="lp-team-avatar" style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }}>
                <span>RM</span>
              </div>
              <h3>Rithik M</h3>
              <div className="lp-team-role">CTO</div>
              <p>Leads technical architecture, product build, and platform security. The engine behind everything you see and use on C.S.</p>
              <div className="lp-team-tags">
                <span>CTO</span><span>Architecture</span><span>Security</span>
              </div>
            </div>
            
            <div className="lp-team-card">
              <div className="lp-team-avatar" style={{ background: "linear-gradient(135deg,#059669,#047857)" }}>
                <span>DG</span>
              </div>
              <h3>Durga Prasad</h3>
              <div className="lp-team-role">Business Development & Ops</div>
              <p>Builds strategic relationships and manages outreach. The bridge between Coin Scanner and the broader ecosystem.</p>
              <div className="lp-team-tags">
                <span>BizDev</span><span>Operations</span><span>Partnerships</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="lp-section lp-contact-section" id="contact">
        <div className="lp-container">
          <div className="lp-contact-grid">
            <div className="lp-contact-left">
              <div className="lp-section-tag">Get in Touch</div>
              <h2 className="lp-section-title" style={{ textAlign: "left", marginBottom: "16px" }}>Start Your Crypto Journey with Confidence</h2>
              <p style={{ color: "#4b5563", lineHeight: 1.7, marginBottom: "32px" }}>
                Coin Scanner makes crypto investing and trading simple, safe, and rewarding. Whether you're starting with ₹100 or scaling up, we're here to guide you every step of the way.
              </p>
              <Link to="/signup" className="lp-btn-primary">
                Join the Waitlist Today <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
            
            <div className="lp-contact-right">
              <div className="lp-contact-card">
                <h3>Contact Us</h3>
                <div className="lp-contact-items">
                  <a href="mailto:coinscanner.tech@gmail.com" className="lp-contact-item">
                    <div className="lp-contact-icon" style={{ background: "#f0fdf4", color: "#16a34a" }}>
                      <Mail size={18} />
                    </div>
                    <div>
                      <span className="lp-contact-label">Email</span>
                      <span className="lp-contact-value">coinscanner.tech@gmail.com</span>
                    </div>
                  </a>
                  <a href="https://instagram.com/Coin.scanner" target="_blank" rel="noreferrer" className="lp-contact-item">
                    <div className="lp-contact-icon" style={{ background: "#fdf4ff", color: "#a21caf" }}>
                      <Instagram size={18} />
                    </div>
                    <div>
                      <span className="lp-contact-label">Instagram</span>
                      <span className="lp-contact-value">@Coin.scanner</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

