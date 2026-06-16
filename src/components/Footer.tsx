import { Link } from "react-router-dom";
import { Handshake, TriangleAlert, Twitter, Linkedin, Instagram } from "lucide-react";
import "./footer.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="pf-footer mt-auto">
      <div className="pf-top">
        <div className="pf-inner">
          <div className="mb-8 md:mb-0">
            <Link to="/" className="pf-logo">
              <img src="https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=80&h=80&fit=crop" alt="CoinScanner" />
              <div className="pf-logo-text">
                <span className="pf-logo-name">COIN SCANNER</span>
                <span className="pf-logo-tagline">Real-time crypto opportunity scanner</span>
              </div>
            </Link>
            <div className="pf-social">
              <a href="#" target="_blank" rel="noreferrer" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="pf-col">
            <h4>Platform</h4>
            <Link to="/">Home</Link>
            <Link to="/compare">Compare Exchanges</Link>
            <Link to="/coins">Markets</Link>
            <Link to="/news">News</Link>
            <Link to="/about">About Us</Link>
          </div>

          <div className="pf-col">
            <h4>Support</h4>
            <Link to="/about#faq">FAQ</Link>
            <Link to="/about#contact">Contact Us</Link>
            <Link to="/about">About</Link>
          </div>

          <div className="pf-col">
            <h4>Legal</h4>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/disclaimer">Disclaimer</Link>
          </div>
        </div>
      </div>

      <div className="pf-investor-band">
        <div className="pf-inner pf-investor-inner flex-col md:flex-row items-start md:items-center">
          <div className="pf-investor-left">
            <div className="pf-investor-icon">
              <Handshake className="w-6 h-6" />
            </div>
            <div>
              <div className="pf-investor-title">Investor Relations</div>
              <p className="pf-investor-desc">
                We're here to connect with investors who share our vision — bringing traders and investors closer, opening doors for conversations, and building partnerships that lead to real growth. Together, we can turn opportunities into lasting impact.
              </p>
            </div>
          </div>
          <Link to="/investors" className="pf-investor-btn mt-6 md:mt-0">
            Get in Touch →
          </Link>
        </div>
      </div>

      <div className="pf-bottom">
        <div className="pf-inner pf-bottom-inner flex-col md:flex-row text-center md:text-left gap-4 md:gap-0">
          <span>© {year} Agreed Financial Tech Pvt. Ltd. — CoinScanner. All rights reserved.</span>
          <span className="pf-bottom-note flex items-center justify-center md:justify-start">
            <TriangleAlert className="w-4 h-4 mr-2" />
            Coin Scanner is a comparison platform, not a broker. Not financial advice.
          </span>
        </div>
      </div>
    </footer>
  );
}
