
import { Link } from "react-router-dom";

import "./Hero.css";

function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-container">

        {/* Hero Content */}
        <div className="hero-content">

          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            BUILT FOR EVERY MOVE
          </div>

          <h1 className="hero-title">
            Play harder.
            <br />
            <span>Go beyond.</span>
          </h1>

          <p className="hero-description">
            From everyday training to game day,
            discover sports gear designed to
            keep you moving, performing, and
            pushing your limits.
          </p>

          {/* CTA Buttons */}
          <div className="hero-actions">
            <Link to="/products" className="hero-btn-primary">
              Shop Collection
              <span aria-hidden="true">↗</span>
            </Link>

            <Link
              to="/products"
              className="hero-btn-secondary"
            >
              Explore Gear
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="hero-highlights">
            <div className="hero-highlight">
              <span className="hero-highlight-icon">✓</span>
              <span>Quality Sports Gear</span>
            </div>

            <div className="hero-highlight">
              <span className="hero-highlight-icon">✓</span>
              <span>Gear Up. Get Moving.</span>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="hero-visual">

          <div className="hero-image-wrapper">
            <img
              src="/images/prolane-hero.jpg"
              alt="Sports equipment ready for training"
              className="hero-image"
            />

            {/* Floating Label */}
            <div className="hero-floating-card">
              <span className="hero-floating-icon">↗</span>

              <div>
                <p className="hero-floating-title">
                  YOUR GAME.
                </p>

                <p className="hero-floating-subtitle">
                  YOUR RULES.
                </p>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="hero-decoration hero-decoration-one"></div>
          <div className="hero-decoration hero-decoration-two"></div>
        </div>

      </div>
    </section>
  );
}

export default Hero;
