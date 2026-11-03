
import { Link } from "react-router-dom";

import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">

        {/* Brand Section */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="footer-logo-mark">P</span>

            <span className="footer-logo-name">
              pro<span>lane</span>
              <span className="footer-logo-dot">.</span>
            </span>
          </Link>

          <p className="footer-description">
            Gear up for your next challenge.
            Discover quality sports essentials
            built for every move.
          </p>

          <div className="footer-socials">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              IG
            </a>

            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              FB
            </a>

            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
            >
              YT
            </a>
          </div>
        </div>

        {/* Shop Links */}
        <div className="footer-column">
          <h3>Shop</h3>

          <Link to="/products">All Products</Link>

          <Link to="/products?category=fitness">
            Fitness
          </Link>

          <Link to="/products?category=cricket">
            Cricket
          </Link>

          <Link to="/products?category=football">
            Football
          </Link>
        </div>

        {/* Customer Support */}
        <div className="footer-column">
          <h3>Customer Care</h3>

          <Link to="/products">Explore Products</Link>

          <a href="mailto:support@prolane.example">
            Contact Support
          </a>

          <Link to="/cart">Shopping Cart</Link>
        </div>

        {/* Brand Message */}
        <div className="footer-column footer-message">
          <h3>Move With Purpose</h3>

          <p>
            Every session counts.
            Find your gear, find your rhythm,
            and push your limits.
          </p>

          <Link to="/products" className="footer-cta">
            Explore the collection
            <span aria-hidden="true"> ↗</span>
          </Link>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Prolane.
          All rights reserved.
        </p>

        <p className="footer-bottom-tagline">
          Made for the love of sport.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
