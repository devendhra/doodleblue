
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Header.css";

function Header() {
  const [searchText, setSearchText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    navigate(
      `/products?q=${encodeURIComponent(searchText.trim())}`
    );

    setMenuOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="header-container">

        {/* Logo */}
        <Link
          to="/"
          className="brand-logo"
          aria-label="Prolane home"
          onClick={closeMenu}
        >
          <span className="brand-mark">P</span>
          <span className="brand-name">
            pro<span>lane</span>
            <span className="brand-dot">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link to="/" className="nav-link">
            Home
          </Link>

          <Link to="/products" className="nav-link">
            Shop
          </Link>

          
        </nav>

        {/* Search */}
        <form
          className="header-search"
          onSubmit={handleSearch}
          role="search"
        >
          <button
            type="submit"
            className="search-button"
            aria-label="Search products"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
          </button>

          <input
            type="search"
            placeholder="Search sports gear..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            aria-label="Search sports products"
          />
        </form>

        {/* Cart */}
        <Link
          to="/cart"
          className="header-cart"
          aria-label="Shopping cart"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 8H6" />
            <circle cx="10" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
          </svg>
        </Link>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          {menuOpen ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="m18 6-12 12M6 6l12 12" />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="mobile-navigation" id="mobile-navigation">
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>

          <Link to="/products" onClick={closeMenu}>
            Shop All
          </Link>

          <Link
            to="/products?category=fitness"
            onClick={closeMenu}
          >
            Fitness
          </Link>

          <Link
            to="/products?category=cricket"
            onClick={closeMenu}
          >
            Cricket
          </Link>

          <form onSubmit={handleSearch} className="mobile-search">
            <input
              type="search"
              placeholder="Search products..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              aria-label="Search sports products"
            />

            <button type="submit">Search</button>
          </form>

          <Link to="/cart" onClick={closeMenu}>
            Shopping Cart
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;
